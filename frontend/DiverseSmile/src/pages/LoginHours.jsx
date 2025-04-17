import React, { useState } from "react";
import "../styles/LoginHours.css";

const LoginHours = () => {
  const [clockInTime, setClockInTime] = useState(null); // Store the clock-in time
  const [submissions, setSubmissions] = useState([]); // Store all submissions
  const [buttonClicked, setButtonClicked] = useState(""); // Track which button was clicked

  const handleClockIn = () => {
    setButtonClicked("clock-in"); // Set animation for Clock In
    setClockInTime(new Date());
    setTimeout(() => setButtonClicked(""), 300); // Reset animation after 300ms
  };

  const handleClockOut = () => {
    if (!clockInTime) {
      alert("Please clock in first!");
      return;
    }

    setButtonClicked("clock-out"); // Set animation for Clock Out

    // Get the current time as the clock-out time
    const clockOutTime = new Date();

    // Calculate the duration in hours and minutes
    const durationMs = clockOutTime - clockInTime;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the duration
    const duration = `${durationHours}h ${durationMinutes}m`;

    // Get the current date
    const date = clockOutTime.toLocaleDateString();

    // Add the new submission to the array
    setSubmissions([...submissions, { date, duration }]);

    // Reset the clock-in time
    setClockInTime(null);

    setTimeout(() => setButtonClicked(""), 300); // Reset animation after 300ms
  };

  return (
    <div className="login-hours-container">
      <h1 className="page-title">Log Your Hours</h1>
      <div className="login-hours-form">
        <button
          onClick={handleClockIn}
          className={`clock-in-button ${buttonClicked === "clock-in" ? "clicked" : ""}`}
        >
          Clock In
        </button>
        <button
          onClick={handleClockOut}
          className={`clock-out-button ${buttonClicked === "clock-out" ? "clicked" : ""}`}
        >
          Clock Out
        </button>
      </div>

      {/* Display all logged submissions below the form */}
      <div className="submitted-data">
        <h2>Clock In/Out Logs</h2>
        {submissions.map((submission, index) => (
          <div key={index} className="submission-entry">
            <p>
              <strong>Date:</strong> {submission.date} | <strong>Duration:</strong> {submission.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginHours;