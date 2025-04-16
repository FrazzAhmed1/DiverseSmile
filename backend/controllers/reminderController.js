import Reminder from '../models/reminderModel.js';
import Appointment from '../models/appointmentModel.js';
import { sendEmail } from '../config/nodemailer.js';

// Schedule reminder (10 seconds for demo instead of 24 hours)
export const scheduleReminder = async (appointmentId, contactInfo) => {
    try {
        const appointment = await Appointment.findById(appointmentId).populate('patientId');
        if (!appointment) {
            console.error('Appointment not found for reminder');
            return;
        }

        // For demo: send after 10 seconds (normally would be 24 hours before)
        const reminderTime = new Date(Date.now() + 10000);

        /*
        // Production version - schedule reminder 24 hours before appointment
        const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
        const reminderTime = new Date(appointmentTime.getTime() - (24 * 60 * 60 * 1000));
        */

        // Delete any existing reminders for this appointment
        await Reminder.deleteMany({ appointmentId });

        const reminder = await Reminder.create({
            appointmentId,
            patientId: appointment.patientId._id,
            contactInfo,
            sendAt: reminderTime
        });

        // Start the reminder timer
        setTimeout(async () => {
            try {
                await sendReminder(reminder._id);
            } catch (err) {
                console.error('Error sending reminder:', err);
            }
        }, 10000); // 10 seconds

        /*
        // Production version - calculate timeout for 24 hours before appointment
        const timeUntilReminder = reminderTime.getTime() - Date.now();
        setTimeout(async () => {
            try {
                await sendReminder(reminder._id);
            } catch (err) {
                console.error('Error sending reminder:', err);
            }
        }, timeUntilReminder);
        */

        return reminder;
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        throw error;
    }
};

// Actually send the reminder
export const sendReminder = async (reminderId) => {
    const reminder = await Reminder.findById(reminderId)
        .populate('appointmentId')
        .populate('patientId');

    if (!reminder || reminder.sent) return;

    const { patientId, appointmentId, contactInfo } = reminder;
    const formattedDate = new Date(appointmentId.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Check if contactInfo is email or phone
    if (contactInfo.includes('@')) {
        // Send email reminder
        await sendEmail({
            to: contactInfo,
            subject: '⏰ Upcoming Dental Appointment Reminder',
            html: `
        <h1>Appointment Reminder</h1>
        <p>Dear ${patientId.firstName},</p>
        <p>This is a friendly reminder about your upcoming dental appointment:</p>
        <h2>${formattedDate} at ${appointmentId.time}</h2>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br/>The DiverseSmile Team</p>
      `
        });
    } else {
        // In a real app, you would integrate with an SMS service here
        console.log(`Would send SMS to ${contactInfo} about appointment`);
    }

    // Mark reminder as sent
    reminder.sent = true;
    await reminder.save();
};

// API endpoint to set reminder
export const setReminder = async (req, res) => {
    try {
        const { appointmentId, contactInfo } = req.body;
        const patientId = req.user._id;

        // Verify appointment belongs to patient
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            patientId
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Delete any existing reminders for this appointment
        await Reminder.deleteMany({ appointmentId });

        const reminder = await scheduleReminder(appointmentId, contactInfo || appointment.patientId.email);
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};