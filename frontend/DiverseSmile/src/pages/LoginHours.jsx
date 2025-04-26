// src/pages/LoginHours.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import '../styles/LoginHours.css';

const API_BASE = 'http://localhost:5000';

export default function LoginHours() {
  const [clockInTime, setClockInTime] = useState(null);
  const [duration, setDuration]     = useState('00:00:00');
  const [logs, setLogs]             = useState([]);
  const token                        = localStorage.getItem('token');

  // live timer
  useEffect(() => {
    if (!clockInTime) return;
    const interval = setInterval(() => {
      const diff = new Date(Date.now() - clockInTime);
      const h    = String(diff.getUTCHours()).padStart(2,'0');
      const m    = String(diff.getUTCMinutes()).padStart(2,'0');
      const s    = String(diff.getUTCSeconds()).padStart(2,'0');
      setDuration(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [clockInTime]);

  // fetch logs
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/login-logs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  // clock in
  const handleClockIn = () => setClockInTime(Date.now());

  // clock out
  const handleClockOut = async () => {
    if (!clockInTime) return;
    // stop timer immediately
    setClockInTime(null);

    const diff = new Date(Date.now() - clockInTime);
    const h    = String(diff.getUTCHours()).padStart(2,'0');
    const m    = String(diff.getUTCMinutes()).padStart(2,'0');
    const s    = String(diff.getUTCSeconds()).padStart(2,'0');
    const totalDuration = `${h}:${m}:${s}`;

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/login-logs`,
        {
          date: new Date(clockInTime).toISOString(),
          duration: totalDuration
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs((prev) => [data, ...prev]);
      setDuration('00:00:00');
    } catch (err) {
      console.error(err);
    }
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${API_BASE}/api/login-logs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-hours-container">
      <Link to="/staff-dashboard" className="back-link">
        🔙 Back to Dashboard
      </Link>

      <h1 className="page-title">Log Your Hours</h1>
      <p className="live-timer">⏱️ Timer: {duration}</p>

      <div className="login-hours-form">
        <button onClick={handleClockIn}  className="clock-in-button">Clock In</button>
        <button onClick={handleClockOut} className="clock-out-button">Clock Out</button>
      </div>

      <div className="manual-add-hours-container">
        <Link to="/manual-log-hours" className="manual-add-hours-btn">
          📝 Manually Add Hours
        </Link>
      </div>

      <div className="submitted-data">
        <h2 className="logs-title">📋 Clock In/Out Logs</h2>
        {logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className={`submission-entry${log.isManual ? ' manual-entry' : ''}`}
            >
              <p>
                <strong>Date:</strong> {format(new Date(log.date), 'PPP')} |{' '}
                <strong>Duration:</strong> {log.duration}
                {log.isManual && (
                  <span className="manual-label">Manually Added</span>
                )}
              </p>
              <button
                className="delete-log-button"
                onClick={() => handleDelete(log._id)}
              >
                ❌ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
