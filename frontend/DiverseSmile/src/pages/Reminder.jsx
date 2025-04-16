import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Reminder.css";
import DiverseSmileLogo from "/src/assets/DiverseSmileLogo.png";

const Reminder = () => {
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!contactInfo) {
      setMessage("Please enter a valid email or phone number.");
      setLoading(false);
      return;
    }

    try {
      // In a real app, you would get the upcoming appointment ID
      // For demo, we'll use the first upcoming appointment
      const response = await fetch('http://localhost:5000/api/appointments/patient', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const appointments = await response.json();
      const upcomingAppointment = appointments.find(a => a.status === 'scheduled');

      if (!upcomingAppointment) {
        throw new Error('No upcoming appointments found');
      }

      // Set the reminder
      const reminderResponse = await fetch('http://localhost:5000/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          appointmentId: upcomingAppointment._id,
          contactInfo
        })
      });

      if (!reminderResponse.ok) {
        throw new Error('Failed to set reminder');
      }

      setMessage(`Reminder set successfully for ${contactInfo}`);
      setContactInfo("");

      // For demo - show a countdown
      let seconds = 10;
      const timer = setInterval(() => {
        if (seconds > 0) {
          setMessage(`Reminder will be sent in ${seconds} seconds...`);
          seconds--;
        } else {
          clearInterval(timer);
          setMessage("Reminder sent! Check your email/text messages.");
        }
      }, 1000);

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src={DiverseSmileLogo} alt="DiverseSmile" />
          DiverseSmile
        </div>
        <div className="nav-buttons">
          <button onClick={() => navigate(-1)} className="nav-btn">Back</button>
        </div>
      </nav>

      <div className="reminder-container">
        <h1>Appointment Reminder</h1>
        <p>Enter your email or phone number to receive appointment reminders.</p>
        <p className="demo-note">DEMO: Reminders will be sent after 10 seconds</p>

        <form onSubmit={handleSubmit} className="reminder-form">
          <input
            type="text"
            placeholder="Enter email or phone number"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="reminder-input"
          />
          <button
            type="submit"
            className="reminder-btn"
            disabled={loading}
          >
            {loading ? 'Setting Reminder...' : 'Set Reminder'}
          </button>
        </form>

        {message && (
          <p className={`reminder-message ${message.includes('sent!') ? 'success' : ''}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Reminder;