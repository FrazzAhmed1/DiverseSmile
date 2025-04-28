import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            default: 75.00
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paymentDate: {
            type: Date,
            default: Date.now
        },
        paymentMethod: {
            type: String,
            default: 'card'
        },
        transactionId: {
            type: String,
            default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;