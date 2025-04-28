import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
        default: 'pending'
    },
    assignedStaffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent double booking and multiple active appointments per patient
appointmentSchema.index({ date: 1, time: 1 }, { unique: true });
appointmentSchema.index({ patientId: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;