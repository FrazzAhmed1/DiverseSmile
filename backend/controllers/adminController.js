// adminController.js
import Admin from "../models/adminModel.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const registerAdmin = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    try {
        const exists = await Admin.findOne({ email });
        if (exists) return res.status(400).json({ message: "Admin already exists" });

        const rawKey = crypto.randomBytes(16).toString("hex");
        const hashedKey = await bcrypt.hash(rawKey, 10);

        const admin = await Admin.create({
            firstName,
            lastName,
            email,
            privateKey: hashedKey,
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                firstName,
                lastName,
                email,
                role: admin.role,
                privateKey: rawKey, // Send raw key once
                token: generateToken(admin._id),
            });
        } else {
            res.status(400).json({ message: "Invalid admin data" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, privateKey } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin && (await admin.matchPrivateKey(privateKey))) {
            res.json({
                _id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or private key" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Logout Admin
// @route   POST /api/admin/logout
// @access  Private
export const logoutAdmin = (req, res) => {
    // Clear any session or token-related logic if applicable
    res.status(200).json({ message: "Admin logged out successfully" });
  };