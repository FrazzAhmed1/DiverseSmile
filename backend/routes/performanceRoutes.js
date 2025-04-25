import express from 'express';
import {
  getStaffPerformance,
  getAllStaffPerformance
} from '../controllers/performanceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorizeRoles('admin'), getAllStaffPerformance);

router.route('/:staffId')
  .get(protect, authorizeRoles('admin', 'staff'), getStaffPerformance);

export default router;