import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import patientLogRoutes from "./routes/patientLogRoutes.js";
import staffLogRoutes from "./routes/staffLogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import loginLogRoutes from "./routes/loginLogRoutes.js"; 
import performanceRoutes from './routes/performanceRoutes.js';
import staffPaymentRoutes from './routes/staffPaymentRoutes.js';
import cors from "cors";

const app = express();
dotenv.config();


app.use(express.json());
app.use(cors());

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/patient-auth", patientLogRoutes);
app.use("/api/staff-auth", staffLogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/login-logs", loginLogRoutes); 
app.use('/api/performance', performanceRoutes);
app.use('/api/staff-payment', staffPaymentRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  connectDB();
});

// 404 and Error Handlers
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Server Error" });
});
