import express from 'express';
import {
    createAppointment,
    getPatientAppointments,
    rescheduleAppointment,
    cancelAppointment,
    getPendingAppointments,
    getStaffAppointments,
    confirmAppointment,
    completeAppointment,
    staffCancelAppointment
} from '../controllers/appointmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createAppointment);

router.route('/patient')
    .get(protect, getPatientAppointments);

router.route('/pending')
    .get(protect, authorizeRoles('staff', 'admin'), getPendingAppointments);

router.route('/staff')
    .get(protect, authorizeRoles('staff', 'admin'), getStaffAppointments);

router.route('/:id/reschedule')
    .put(protect, rescheduleAppointment);

router.route('/:id/cancel')
    .put(protect, cancelAppointment);

router.route('/:id/confirm')
    .put(protect, authorizeRoles('staff', 'admin'), confirmAppointment);

router.route('/:id/complete')
    .put(protect, authorizeRoles('staff', 'admin'), completeAppointment);

router.route('/:id/staff-cancel')
    .put(protect, authorizeRoles('staff', 'admin'), staffCancelAppointment);

export default router;
