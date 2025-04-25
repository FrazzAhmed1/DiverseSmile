import Patient from "../models/patientModel.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from '../config/nodemailer.js';

// @desc    Register a new patient
// @route   POST /api/patients/register
// @access  Public
export const registerPatient = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (patient) {
      await sendEmail({
        to: patient.email,
        subject: 'Welcome to DiverseSmile!',
        html: `
          <h1>Welcome, ${patient.firstName}!</h1>
          <p>Thank you for registering with DiverseSmile.</p>
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

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id).select('-password');
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private
export const updatePatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);
    
    if (patient) {
      patient.firstName = req.body.firstName || patient.firstName;
      patient.lastName = req.body.lastName || patient.lastName;
      patient.email = req.body.email || patient.email;
      patient.address = req.body.address || patient.address;
      patient.gender = req.body.gender || patient.gender;
      patient.age = req.body.age || patient.age;
      patient.phone = req.body.phone || patient.phone;
      patient.medicalHistory = req.body.medicalHistory || patient.medicalHistory;

      const updatedPatient = await patient.save();
      
      res.json({
        _id: updatedPatient._id,
        firstName: updatedPatient.firstName,
        lastName: updatedPatient.lastName,
        email: updatedPatient.email,
        address: updatedPatient.address,
        gender: updatedPatient.gender,
        age: updatedPatient.age,
        phone: updatedPatient.phone,
        medicalHistory: updatedPatient.medicalHistory,
      });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private/Admin
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout patient
// @route   POST /api/patients/logout
// @access  Private
export const logoutPatient = (req, res) => {
  // Clear any session or token-related logic if applicable
  res.status(200).json({ message: "Patient logged out successfully" });
};