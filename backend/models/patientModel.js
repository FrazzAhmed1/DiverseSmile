import mongoose from "mongoose";
import bcrypt from "bcrypt";

const patientSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    age: { type: Number },
    phone: { type: String },
    medicalHistory: { type: String },
    profilePicture: { type: String },
    role: { type: String, default: "patient" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    appointments: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Appointment' 
    }]
  },
  { timestamps: true }
);

// Hash password before saving
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;