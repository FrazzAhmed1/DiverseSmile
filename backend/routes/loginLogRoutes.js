// backend/routes/loginLogRoutes.js

import express from 'express';
import LoginLog from '../models/loginLogModel.js';
import { protect } from '../middleware/authMiddleware.js';   // ← use your protect middleware

const router = express.Router();

/**
 * @route   GET /api/login-logs
 * @desc    Get all logs for the authenticated staff member
 * @access  Protected
 */
router.get('/', protect, async (req, res) => {
  try {
    const logs = await LoginLog.find({ staffId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error('Error fetching login logs:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/login-logs
 * @desc    Create a new clock‐in/out or manual log
 * @access  Protected
 */
router.post('/', protect, async (req, res) => {
  const { date, duration, isManual = false } = req.body;
  try {
    const newLog = await LoginLog.create({
      staffId:  req.user.id,
      date,
      duration,
      isManual: Boolean(isManual),
    });
    res.status(201).json(newLog);
  } catch (err) {
    console.error('Error creating login log:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/login-logs/:id
 * @desc    Delete a log by ID (only if it belongs to the logged‐in staff)
 * @access  Protected
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await LoginLog.findOneAndDelete({
      _id:      req.params.id,
      staffId:  req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json({ message: 'Log deleted' });
  } catch (err) {
    console.error('Error deleting login log:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
