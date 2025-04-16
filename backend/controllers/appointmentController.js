import Appointment from '../models/appointmentModel.js';
import Patient from '../models/patientModel.js';
import Reminder from '../models/reminderModel.js';
import { sendEmail } from '../config/nodemailer.js';
import { scheduleReminder } from './reminderController.js';

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
            status: 'scheduled'
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