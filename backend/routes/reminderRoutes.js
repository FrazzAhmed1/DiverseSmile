import express from 'express';
import { setReminder } from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, setReminder);

export default router;