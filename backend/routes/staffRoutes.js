import express from "express";
import { registerStaff, logoutStaff } from "../controllers/staffController.js";

const router = express.Router();

router.post("/register", registerStaff);
router.post("/logout", logoutStaff);


export default router;