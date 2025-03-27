// adminModel.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    privateKey: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

adminSchema.methods.matchPrivateKey = async function (enteredKey) {
  return await bcrypt.compare(enteredKey, this.privateKey);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;