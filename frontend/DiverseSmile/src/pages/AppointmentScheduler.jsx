// AppointmentScheduler.jsx
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Home.css';
import DiverseSmileLogo from '/src/assets/DiverseSmileLogo.png';

const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [cancelMsg, setCancelMsg] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [reschedulingId, setReschedulingId] = useState(null);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  ];

  useEffect(() => {
    if (confirmation) {
      const timer = setTimeout(() => setConfirmation(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [confirmation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setConfirmation("⚠️ Please select both a date and time.");
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const exists = appointments.some(appt =>
      appt.date === formattedDate && appt.time === selectedTime
    );
    if (exists && !reschedulingId) {
      setConfirmation(`⚠️ You already have an appointment for ${formattedDate} at ${selectedTime}`);
      return;
    }

    if (reschedulingId) {
      const updated = appointments.map(appt =>
        appt.id === reschedulingId
          ? { ...appt, date: formattedDate, time: selectedTime }
          : appt
      );
      setAppointments(updated);
      setConfirmation(`🔄 Appointment rescheduled to ${formattedDate} at ${selectedTime}`);
      setReschedulingId(null);
    } else {
      const newAppointment = {
        id: Date.now(),
        date: formattedDate,
        time: selectedTime
      };
      setAppointments([newAppointment, ...appointments]);
      setConfirmation(`✅ Appointment confirmed for ${formattedDate} at ${selectedTime}`);
    }

    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setConfirmation('');
    setReschedulingId(null);
  };

  const handleDelete = (id, date, time) => {
    setAppointments(appointments.filter(appt => appt.id !== id));
    setCancelMsg(`❌ Appointment for ${date} at ${time} has been cancelled`);
    setTimeout(() => setCancelMsg(''), 3000);
  };

  const handleReschedule = (id) => {
    setReschedulingId(id);
    setSelectedDate(null);
    setSelectedTime('');
    setConfirmation('🛠️ Pick a New Time and Date');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src={DiverseSmileLogo} alt="Logo" />
          DiverseSmile
        </div>
        <div className="nav-buttons">
          <Link to="/patient-dashboard" className="nav-btn">Dashboard</Link>
          <button className="nav-btn">Logout</button>
          <Link to="/schedule-reminder" className="nav-btn">Set a Reminder</Link>
        </div>
      </nav>

      <div className="dashboard-container" style={{ marginTop: "140px", padding: "40px", borderRadius: "20px", backgroundColor: "#b2ebf2" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>📅 Schedule Your Appointment</h1>
        <p style={{ fontSize: "18px", color: "#333", marginBottom: "30px" }}>
          Please choose a day and time for your dental visit below.
        </p>

        <form onSubmit={handleSubmit} className="form-layout">
          <div className="input-group">
            <label>📆 Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              placeholderText="Click to pick a date"
              className="form-input"
            />
          </div>

          <div className="input-group" style={{ marginTop: '10px' }}>
            <label>⏰ Select Time:</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="form-input"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button type="submit" className="appointment-btn" style={{ marginRight: "10px" }}>
              {reschedulingId ? 'Confirm Reschedule' : 'Confirm Appointment'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="nav-btn"
              style={{ padding: "6px 20px", fontSize: "14px" }}
            >
              {reschedulingId ? 'Cancel' : 'Reset'}
            </button>
          </div>
        </form>

        {confirmation && <div className="toast confirm-toast">{confirmation}</div>}
        {cancelMsg && <div className="toast cancel-toast">{cancelMsg}</div>}

        {appointments.length > 0 && (
          <div style={{ marginTop: "40px", textAlign: "left" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>📝 Upcoming Appointments</h2>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {appointments.map(({ id, date, time }) => (
                <li key={id} style={{
                  backgroundColor: "#fff",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}>
                  <span>📍 <strong>{date}</strong> at <strong>{time}</strong></span>
                  <div>
                    <button
                      onClick={() => handleReschedule(id)}
                      style={{
                        backgroundColor: "#f0c14b",
                        color: "black",
                        marginRight: "10px",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        cursor: "pointer"
                      }}
                    >
                      🔄 Reschedule
                    </button>
                    <button
                      onClick={() => handleDelete(id, date, time)}
                      style={{
                        backgroundColor: "#ff4d4d",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        cursor: "pointer"
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        .toast {
          margin-top: 30px;
          padding: 15px 20px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
          animation: slideIn 0.4s ease forwards;
        }
        .confirm-toast {
          background-color: #d3f7c4;
          color: #2c6e49;
        }
        .cancel-toast {
          background-color: #ffe2e2;
          color: #b30000;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default AppointmentScheduler;
