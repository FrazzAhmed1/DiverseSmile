// controllers/paymentController.js
import Payment from '../models/paymentModel.js';

// @desc    Get patient's payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ patientId: req.user._id })
            .populate('patientId', 'firstName lastName')
            .populate('appointmentId', 'date time status')
            .sort({ paymentDate: -1 });

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
export const processPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Find the pending payment
        const payment = await Payment.findOne({
            appointmentId,
            patientId: req.user._id,
            status: 'pending'
        });

        if (!payment) {
            return res.status(404).json({ message: 'No pending payment found for this appointment' });
        }

        payment.status = 'completed';
        payment.paymentDate = new Date();
        await payment.save();

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payment transactions (admin only)
// @route   GET /api/payments/all
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({})
            .populate('patientId', 'firstName lastName')
            .populate('appointmentId', 'date')
            .sort({ paymentDate: -1 });
            
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};