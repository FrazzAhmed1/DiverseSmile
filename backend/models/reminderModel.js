import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    sendAt: {
        type: Date,
        required: true
    },
    sent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;