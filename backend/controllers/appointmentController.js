import Appointment from '../models/appointmentModel.js';
import Patient from '../models/patientModel.js';
import Staff from '../models/staffModel.js';
import Reminder from '../models/reminderModel.js';
import { sendEmail } from '../config/nodemailer.js';
import { scheduleReminder } from './reminderController.js';
import { updateStaffPerformance } from './performanceController.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;
        const patientId = req.user._id;

        // Check if slot is available
        const existingAppointment = await Appointment.findOne({ date, time });
        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patientId,
            date,
            time,
            status: 'pending'
        });

        // Get patient details for email
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Send confirmation email
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await sendEmail({
            to: patient.email,
            subject: 'Appointment Confirmation - DiverseSmile',
            html: `
        <h1>Your Appointment is Confirmed</h1>
        <p>Dear ${patient.firstName} ${patient.lastName},</p>
        <p>Your dental appointment has been scheduled for:</p>
        <h2>${formattedDate} at ${time}</h2>
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br/>The DiverseSmile Team</p>
      `
        });

        await scheduleReminder(appointment._id, patient.email);

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all appointments for a patient
// @route   GET /api/appointments/patient
// @access  Private
export const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id })
            .sort({ date: 1, time: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
export const rescheduleAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;
        const appointmentId = req.params.id;

        // Check if new slot is available
        const existingAppointment = await Appointment.findOne({ date, time });
        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { date, time, status: 'rescheduled' },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Get patient details for email
        const patient = await Patient.findById(updatedAppointment.patientId);
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await sendEmail({
            to: patient.email,
            subject: 'Appointment Rescheduled - DiverseSmile',
            html: `
        <h1>Your Appointment Has Been Rescheduled</h1>
        <p>Dear ${patient.firstName} ${patient.lastName},</p>
        <p>Your dental appointment has been rescheduled to:</p>
        <h2>${formattedDate} at ${time}</h2>
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <p>If you need to make further changes, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br/>The DiverseSmile Team</p>
      `
        });

        // Cancel any existing reminders and schedule new one
        await Reminder.deleteMany({ appointmentId });
        await scheduleReminder(updatedAppointment._id, patient.email);

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Get patient details for email
        const patient = await Patient.findById(appointment.patientId);
        const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await sendEmail({
            to: patient.email,
            subject: 'Appointment Cancellation - DiverseSmile',
            html: `
        <h1>Your Appointment Has Been Cancelled</h1>
        <p>Dear ${patient.firstName} ${patient.lastName},</p>
        <p>Your dental appointment scheduled for:</p>
        <h2>${formattedDate} at ${appointment.time}</h2>
        <p>has been cancelled as per your request.</p>
        <p>If this was a mistake or you'd like to reschedule, please contact us.</p>
        <p>Best regards,<br/>The DiverseSmile Team</p>
      `
        });

        // Cancel any pending reminders
        await Reminder.deleteMany({ appointmentId: appointment._id });

        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get all pending appointments (for staff dashboard)
// @route   GET /api/appointments/pending
// @access  Private/Staff
export const getPendingAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ status: 'pending' })
            .populate('patientId', 'firstName lastName')
            .sort({ date: 1, time: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get staff's confirmed appointments
// @route   GET /api/appointments/staff
// @access  Private/Staff
export const getStaffAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            assignedStaffId: req.user._id,
            status: { $in: ['confirmed'] }
        })
            .populate('patientId', 'firstName lastName')
            .sort({ date: 1, time: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Staff confirms an appointment
// @route   PUT /api/appointments/:id/confirm
// @access  Private/Staff
export const confirmAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.status !== 'pending') {
            return res.status(400).json({ message: 'Appointment is not pending confirmation' });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                status: 'confirmed',
                assignedStaffId: req.user._id
            },
            { new: true }
        ).populate('patientId', 'firstName lastName email');

        // Notify patient about staff confirmation
        const formattedDate = new Date(updatedAppointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await sendEmail({
            to: updatedAppointment.patientId.email,
            subject: 'Appointment Confirmed - DiverseSmile',
            html: `
                <h1>Your Appointment Has Been Confirmed</h1>
                <p>Dear ${updatedAppointment.patientId.firstName},</p>
                <p>Your dental appointment has been confirmed for:</p>
                <h2>${formattedDate} at ${updatedAppointment.time}</h2>
                <p>Your assigned dental professional will be in touch if needed.</p>
                <p>Best regards,<br/>The DiverseSmile Team</p>
            `
        });

        await updateStaffPerformance(req.user._id, 'confirmed');

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Staff marks appointment as complete
// @route   PUT /api/appointments/:id/complete
// @access  Private/Staff
export const completeAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.id,
                assignedStaffId: req.user._id
            },
            { status: 'completed' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or not assigned to you' });
        }

        await updateStaffPerformance(appointment.assignedStaffId, 'completed');

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Staff cancels an appointment
// @route   PUT /api/appointments/:id/staff-cancel
// @access  Private/Staff
export const staffCancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.id,
                assignedStaffId: req.user._id
            },
            { status: 'cancelled' },
            { new: true }
        ).populate('patientId', 'firstName lastName email');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or not assigned to you' });
        }

        // Notify patient about cancellation
        const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await sendEmail({
            to: appointment.patientId.email,
            subject: 'Appointment Cancelled - DiverseSmile',
            html: `
                <h1>Your Appointment Has Been Cancelled</h1>
                <p>Dear ${appointment.patientId.firstName},</p>
                <p>We regret to inform you that your dental appointment scheduled for:</p>
                <h2>${formattedDate} at ${appointment.time}</h2>
                <p>has been cancelled by our staff.</p>
                <p>Please contact us to reschedule or for more information.</p>
                <p>Best regards,<br/>The DiverseSmile Team</p>
            `
        });

        await updateStaffPerformance(appointment.assignedStaffId, 'cancelled');

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};