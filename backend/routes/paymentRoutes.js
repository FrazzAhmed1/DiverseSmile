import express from "express";
import { 
    getPaymentHistory, 
    processPayment, 
    getAllPayments 
} from "../controllers/paymentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", protect, getPaymentHistory);
router.post("/process", protect, processPayment);
router.get("/all", protect, authorizeRoles('admin'), getAllPayments);

export default router;