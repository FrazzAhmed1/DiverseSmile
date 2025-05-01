// adminController.js
import Admin from "../models/adminModel.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const registerAdmin = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    //this code checks if the admin already exist by the email. 
    try {
        const exists = await Admin.findOne({ email });
        if (exists) return res.status(400).json({ message: "Admin already exists" });

        //this generates a private key and hashs it for the storage purposes 
        const rawKey = crypto.randomBytes(16).toString("hex");
        const hashedKey = await bcrypt.hash(rawKey, 10);

        //this object is used to create a new admin. 
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
            //this will pop up if the admin creation process fails 
            res.status(400).json({ message: "Invalid admin data" });
        }
    } catch (err) {
        //this handles the server error.
        res.status(500).json({ message: err.message });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, privateKey } = req.body;
    try {
        //this finds the existing admin by the email. 
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
            //if the credentials are wrong this will pop up. 
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
