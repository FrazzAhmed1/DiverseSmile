import Patient from "../models/patientModel.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from '../config/nodemailer.js';

// @desc    Register a new patient
// @route   POST /api/patients/register
// @access  Public
export const registerPatient = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if patient already exists
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    // Create new patient
    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (patient) {
      // Send welcome email
      await sendEmail({
        to: patient.email, // or staff.email
        subject: 'Welcome to DiverseSmile!',
        html: `
      <h1>Welcome, ${patient.firstName}!</h1>
      <p>Thank you for registering with DiverseSmile.</p>
      <p>You can now book appointments and manage your dental care with us.</p>
      <p>If you have any questions, please contact our support team.</p>
    `,
      });
      res.status(201).json({
        _id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        role: patient.role,
        token: generateToken(patient._id),
      });
    } else {
      res.status(400).json({ message: "Invalid patient data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
