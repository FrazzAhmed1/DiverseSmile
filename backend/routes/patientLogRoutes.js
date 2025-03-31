import express from "express";
import { loginPatient } from "../controllers/patientLogController.js";

const router = express.Router();

router.post("/login", loginPatient);

export default router;