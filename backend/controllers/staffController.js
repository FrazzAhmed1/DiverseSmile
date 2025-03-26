import Staff from "../models/staffModel.js";
import generateToken from "../utils/generateToken.js";

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