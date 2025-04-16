import express from 'express';
import {
    createAppointment,
    getPatientAppointments,
    rescheduleAppointment,
    cancelAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createAppointment);

router.route('/patient')
    .get(protect, getPatientAppointments);

router.route('/:id/reschedule')
    .put(protect, rescheduleAppointment);

router.route('/:id/cancel')
    .put(protect, cancelAppointment);

export default router;