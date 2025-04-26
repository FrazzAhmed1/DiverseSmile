// src/pages/ManuallyAddHours.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ManuallyAddHours.css';

const API_BASE = 'http://localhost:5000';

export default function ManuallyAddHours() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [date, setDate] = useState('');
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !clockInTime || !clockOutTime) {
      setError('All fields are required.');
      return;
    }

    const inDate = new Date(`${date}T${clockInTime}`);
    const outDate = new Date(`${date}T${clockOutTime}`);
    if (outDate <= inDate) {
      setError('Clock-out must be after clock-in.');
      return;
    }

    // compute HH:MM:SS
    const diffMs = outDate - inDate;
    const diff = new Date(diffMs);
    const h = String(diff.getUTCHours()).padStart(2, '0');
    const m = String(diff.getUTCMinutes()).padStart(2, '0');
    const s = String(diff.getUTCSeconds()).padStart(2, '0');
    const duration = `${h}:${m}:${s}`;

    try {
      await axios.post(
        `${API_BASE}/api/login-logs`,
        { date: inDate.toISOString(), duration, isManual: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // ← navigate back to the log‐hours page
      navigate('/staff-dashboard', { state: { tab: 'logHours' } });
    } catch (err) {
      console.error('Error saving manual log:', err);
      setError('Failed to save. Please try again.');
    }
  };

  return (
    <div className="manual-log-container">
      <Link to="/login-hours" className="back-link">
        🔙 Back to Log Hours
      </Link>

      <h1 className="page-title">Manually Add Hours</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="manual-log-form">
        <label htmlFor="date">
          Date:
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>

        <label htmlFor="clockIn">
          Clock In:
          <input
            id="clockIn"
            type="time"
            value={clockInTime}
            onChange={e => setClockInTime(e.target.value)}
            required
          />
        </label>

        <label htmlFor="clockOut">
          Clock Out:
          <input
            id="clockOut"
            type="time"
            value={clockOutTime}
            onChange={e => setClockOutTime(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
