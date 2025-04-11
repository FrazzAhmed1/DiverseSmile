import Patient from '../models/patientModel.js';
import Staff from '../models/staffModel.js';
import { sendEmail } from '../config/nodemailer.js';
import crypto from "crypto";

// Generate random 6-digit code
const generateResetCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Forgot password request
export const forgotPassword = async (req, res) => {
    const { firstName, lastName, email, role } = req.body;

    try {
        // Validate input
        if (!firstName || !lastName || !email || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user based on role
        let user;
        if (role === 'patient') {
            user = await Patient.findOne({ email, firstName, lastName });
        } else if (role === 'staff') {
            user = await Staff.findOne({ email, firstName, lastName });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found with provided details" });
        }

        // Generate and save reset token
        const resetCode = generateResetCode();
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        // Send email
        const emailSent = await sendEmail({
            to: user.email,
            subject: 'Password Reset Code',
            html: `
        <h1>Password Reset Request</h1>
        <p>Here is your verification code:</p>
        <h2>${resetCode}</h2>
        <p>This code will expire in 15 minutes.</p>
      `,
        });

        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send reset email" });
        }

        res.status(200).json({ message: "Reset code sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify reset code
export const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        // Check both patient and staff collections
        let user = await Patient.findOne({ email, resetPasswordToken: code }) ||
            await Staff.findOne({ email, resetPasswordToken: code });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Code has expired" });
        }

        res.status(200).json({ message: "Code verified" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        // Check both collections
        let user = await Patient.findOne({ email, resetPasswordToken: code }) ||
            await Staff.findOne({ email, resetPasswordToken: code });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Code has expired" });
        }

        // Update password and clear reset fields
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};