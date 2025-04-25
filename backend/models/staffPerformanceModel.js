import mongoose from "mongoose";

const staffPerformanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    unique: true
  },
  totalAppointmentsConfirmed: {
    type: Number,
    default: 0
  },
  totalAppointmentsCompleted: {
    type: Number,
    default: 0
  },
  totalAppointmentsCancelled: {
    type: Number,
    default: 0
  },
  completionRate: {  
    type: Number,
    default: 0
  },
  cancellationRate: {  
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

staffPerformanceSchema.pre('save', function(next) {
  if (this.totalAppointmentsConfirmed > 0) {
    this.completionRate = (this.totalAppointmentsCompleted / this.totalAppointmentsConfirmed) * 100;
    this.cancellationRate = (this.totalAppointmentsCancelled / this.totalAppointmentsConfirmed) * 100;
  } else {
    this.completionRate = 0;
    this.cancellationRate = 0;
  }
  next();
});

const StaffPerformance = mongoose.model('StaffPerformance', staffPerformanceSchema);
export default StaffPerformance;