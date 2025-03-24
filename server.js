import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import cors from "cors"; // Import the cors middleware run npm install cors

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/staff", staffRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  connectDB();
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Server Error" });
});
