import bcrypt from 'bcrypt';
import Staff from '../models/staffModel.js';
import generateToken from '../utils/generateToken.js';

const loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const staff = await Staff.findOne({ email });

        if (!staff) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, staff.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(staff._id);
        res.status(200).json({
            token,
            id: staff._id,
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email,
            role: 'staff'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export { loginStaff };
