import express from "express";
import { 
  registerPatient,
  getPatients,
  getPatientProfile,
  updatePatientProfile,
  getPatientById,
  logoutPatient
} from "../controllers/patientController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { logoutPatient } from "../controllers/patientController.js";

const router = express.Router();

router.post("/register", registerPatient);
router.get("/", protect, authorizeRoles('admin', 'staff'), getPatients);
router.get("/profile", protect, getPatientProfile);
router.put("/profile", protect, updatePatientProfile);
router.get("/:id", protect, authorizeRoles('admin'), getPatientById);
router.post("/logout", logoutPatient);

const handleLogout = async () => {
    try {
        console.log("Attempting to log out...");
        const response = await axios.post("/api/patients/logout");

        if (response.status === 200) {
            console.log("Logout successful");
            // Clear user data from localStorage
            localStorage.removeItem("user");

            // Redirect to the homepage
            navigate("/");
        } else {
            console.error("Logout failed:", response.data.message);
        }
    } catch (error) {
        console.error("Error logging out:", error.response?.data?.message || error.message);
        // Redirect to the homepage as a fallback
        navigate("/");
    }
};

export default router;