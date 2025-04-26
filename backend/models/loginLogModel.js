// src/models/loginLogModel.js

import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    isManual: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const LoginLog = mongoose.model("LoginLog", loginLogSchema);
export default LoginLog;
