import LoginLog from "../models/loginLogModel.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await LoginLog.find({ staffId: req.user._id }).sort({ createdAt: -1 });
    //this returns the log in the JSON format 
    res.json(logs); 
  } catch (err) {
    //this handles the unexpected error. 
    res.status(500).json({ message: "Server error" }); 
  }
};

export const addLog = async (req, res) => {
  const { date, duration } = req.body;
  try {
    const log = new LoginLog({ staffId: req.user._id, date, duration });
    //this saves the log into the database
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: "Failed to save log" });
  }
};

export const deleteLog = async (req, res) => {
  try {
    //this deletes the log only after checking if it belongs to the correct user. 
    await LoginLog.deleteOne({ _id: req.params.id, staffId: req.user._id });
    res.json({ message: "Log deleted" });
  } catch (err) {
    //this handles error for when the user is trying to delete the log 
    res.status(500).json({ message: "Failed to delete log" }); 
  }
};
