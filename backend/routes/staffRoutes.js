import express from "express";
import { registerStaff } from "../controllers/staffController.js";

const router = express.Router();

router.post("/register", registerStaff);

export default router;