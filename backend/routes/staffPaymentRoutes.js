import express from 'express';
import LoginLog from '../models/loginLogModel.js';
import Staff from '../models/staffModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/staff-payment
 * @desc    Get payment data for all staff members
 * @access  Private/Admin
 */
router.get('/', protect, admin, async (req, res) => {
  try {
    // Get all staff members
    const staffMembers = await Staff.find({}).select('_id firstName lastName hourlyRate');
    
    // Calculate payment data for each staff member
    const paymentData = await Promise.all(staffMembers.map(async (staff) => {
      // Get all login logs for this staff member
      const logs = await LoginLog.find({ staffId: staff._id });
      
      // Calculate total hours worked
      let totalSeconds = 0;
      logs.forEach(log => {
        const [h, m, s] = log.duration.split(':').map(Number);
        totalSeconds += h * 3600 + m * 60 + s;
      });
      
      const hoursWorked = totalSeconds / 3600;
      const hourlyRate = staff.hourlyRate || 145; // Default to $145 if not set
      const grossPay = hoursWorked * hourlyRate;
      const taxRate = 0.1; // 10% tax
      const taxAmount = grossPay * taxRate;
      const netPay = grossPay - taxAmount;
      
      return {
        staffId: staff._id,
        name: `${staff.firstName} ${staff.lastName}`,
        hourlyRate,
        hoursWorked: parseFloat(hoursWorked.toFixed(2)),
        grossPay: parseFloat(grossPay.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        netPay: parseFloat(netPay.toFixed(2)),
        logCount: logs.length,
        lastUpdated: new Date()
      };
    }));
    
    res.json(paymentData);
  } catch (err) {
    console.error('Error fetching staff payment data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;