import express from "express";
import { 
  registerPatient,
  getPatients,
  getPatientProfile,
  updatePatientProfile,
  getPatientById
} from "../controllers/patientController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerPatient);
router.get("/", protect, authorizeRoles('admin', 'staff'), getPatients);
router.get("/profile", protect, getPatientProfile);
router.put("/profile", protect, updatePatientProfile);
router.get("/:id", protect, authorizeRoles('admin'), getPatientById);

export default router;