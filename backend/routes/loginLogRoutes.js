import express from "express";
import { getLogs, addLog, deleteLog } from "../controllers/loginLogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLogs);
router.post("/", protect, addLog); // <--- this line is critical
router.delete("/:id", protect, deleteLog);

export default router;

