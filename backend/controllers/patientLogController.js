import bcrypt from 'bcrypt';
import Patient from '../models/patientModel.js';
import generateToken from '../utils/generateToken.js';

const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(401).json({ message: "Invalid credentials" }); // Generic message for security
        }

        const isMatch = await bcrypt.compare(password, patient.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(patient._id); // Using _id instead of email
        res.status(200).json({
            token,
            id: patient._id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            role: 'patient'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export { loginPatient };
