import jwt from 'jsonwebtoken';
import Patient from '../models/patientModel.js';
import Staff from '../models/staffModel.js';
import Admin from '../models/adminModel.js';

// Protect routes - verify JWT
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check Admin, then Staff, then Patient
      req.user =
        (await Admin.findById(decoded.id)) ||
        (await Staff.findById(decoded.id)) ||
        (await Patient.findById(decoded.id));

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin authorization middleware
export const admin = async (req, res, next) => {
  // Check if user exists and is admin
  if (!req.user || req.user.constructor.modelName !== 'Admin') {
    return res.status(403).json({ 
      message: 'Not authorized as admin' 
    });
  }
  next();
};

// Role-based authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};