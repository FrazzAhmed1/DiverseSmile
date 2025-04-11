import express from 'express';
import {
    forgotPassword,
    verifyResetCode,
    resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;