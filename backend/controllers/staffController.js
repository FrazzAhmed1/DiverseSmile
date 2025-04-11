import Staff from "../models/staffModel.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from '../config/nodemailer.js';


// @desc    Register a new staff member
// @route   POST /api/staff/register
// @access  Public
export const registerStaff = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if staff already exists
    const staffExists = await Staff.findOne({ email });
    if (staffExists) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    // Create new staff
    const staff = await Staff.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (staff) {
      // Send welcome email
      await sendEmail({
        to: staff.email, // or staff.email
        subject: 'Welcome to DiverseSmile!',
        html: `
      <h1>Welcome, ${staff.firstName}!</h1>
      <p>Thank you for registering with DiverseSmile.</p>
      <p>You can now book appointments and manage your dental care with us.</p>
      <p>If you have any questions, please contact our support team.</p>
    `,
      });
      res.status(201).json({
        _id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role,
        token: generateToken(staff._id),
      });
    } else {
      res.status(400).json({ message: "Invalid staff data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
