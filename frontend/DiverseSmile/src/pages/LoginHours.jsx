import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import '../styles/LoginHours.css';

const LoginHours = () => {
  const [clockInTime, setClockInTime] = useState(null);
  const [duration, setDuration] = useState('00:00:00');
  const [timer, setTimer] = useState(null);
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (clockInTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = new Date(now - clockInTime);
        const hours = String(diff.getUTCHours()).padStart(2, '0');
        const minutes = String(diff.getUTCMinutes()).padStart(2, '0');
        const seconds = String(diff.getUTCSeconds()).padStart(2, '0');
        setDuration(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [clockInTime]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:3300/api/login-logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else {
          console.error('Expected array but got:', res.data);
        }
      } catch (err) {
        console.error('Error fetching logs', err);
      }
    };
    if (token) fetchLogs();
  }, [token]);

  const handleClockIn = () => {
    setClockInTime(new Date());
  };

  const handleClockOut = async () => {
    if (!clockInTime) return;

    clearInterval(timer);
    const clockOutTime = new Date();
    const workedDuration = new Date(clockOutTime - clockInTime);
    const hours = String(workedDuration.getUTCHours()).padStart(2, '0');
    const minutes = String(workedDuration.getUTCMinutes()).padStart(2, '0');
    const seconds = String(workedDuration.getUTCSeconds()).padStart(2, '0');
    const totalDuration = `${hours}:${minutes}:${seconds}`;
    const date = clockOutTime.toISOString();

    try {
      const res = await axios.post(
        'http://localhost:3300/api/login-logs',
        { date, duration: totalDuration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs([res.data, ...logs]);
    } catch (err) {
      console.error('Error saving log', err);
    }

    setClockInTime(null);
    setDuration('00:00:00');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3300/api/login-logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(logs.filter(log => log._id !== id));
    } catch (err) {
      console.error('Error deleting log', err);
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
        <button onClick={handleClockIn} className="clock-in-button">
          Clock In
        </button>
        <button onClick={handleClockOut} className="clock-out-button">
          Clock Out
        </button>
      </div>

      <div className="submitted-data">
        <h2 className="logs-title">📋 Clock In/Out Logs</h2>
        {logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="submission-entry">
              <p>
                <strong>Date:</strong> {format(new Date(log.date), 'PPP')} | <strong>Duration:</strong> {log.duration}
              </p>
              <button className="delete-log-button" onClick={() => handleDelete(log._id)}>
                ❌ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoginHours;
