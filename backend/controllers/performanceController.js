import StaffPerformance from '../models/staffPerformanceModel.js';
import Staff from '../models/staffModel.js';
import Appointment from '../models/appointmentModel.js';

// @desc    Update staff performance metrics when appointment status changes
// @route   (This will be called internally, not via API)
export const updateStaffPerformance = async (staffId, action) => {
  try {
    // Find or create performance record
    let performance = await StaffPerformance.findOne({ staffId });
    
    if (!performance) {
      performance = await StaffPerformance.create({ staffId });
    }

    // Update based on action
    switch(action) {
      case 'confirmed':
        performance.totalAppointmentsConfirmed += 1;
        break;
      case 'completed':
        performance.totalAppointmentsCompleted += 1;
        break;
      case 'cancelled':
        performance.totalAppointmentsCancelled += 1;
        break;
    }

    performance.lastUpdated = new Date();
    await performance.save();
  } catch (error) {
    console.error('Error updating staff performance:', error);
  }
};

// @desc    Get performance metrics for a staff member
// @route   GET /api/performance/:staffId
// @access  Private/Admin
export const getStaffPerformance = async (req, res) => {
  try {
    const performance = await StaffPerformance.findOne({ staffId: req.params.staffId })
      .populate('staffId', 'firstName lastName email');

    if (!performance) {
      return res.status(404).json({ message: 'Performance data not found for this staff member' });
    }

    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get performance metrics for all staff members
// @route   GET /api/performance
// @access  Private/Admin
export const getAllStaffPerformance = async (req, res) => {
  try {
    const performances = await StaffPerformance.find()
      .populate('staffId', 'firstName lastName email')
      .sort({ 'completionRate': -1 }); // Sort by completion rate descending

    res.status(200).json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};