// components/LogHours.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LogHours = () => {
  const [date, setDate] = useState(null);
  const [hours, setHours] = useState('');
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    if (!date || !hours) {
      setMessage("⚠️ Please enter both date and hours.");
      return;
    }

    const formattedDate = date.toLocaleDateString();
    const newEntry = { date: formattedDate, hours: parseFloat(hours) };

    setLogs([...logs, newEntry]);
    setDate(null);
    setHours('');
    setMessage('');
  };

  const handleSendToHR = () => {
    setMessage("✅ Your hours have been sent to HR (mock action).");
    // Later: Hook this into a real API
  };

  return (
    <div className="appointments">
      <h2>🕒 Log In Hours</h2>
      {message && <p style={{ color: message.includes('⚠️') ? 'red' : 'green' }}>{message}</p>}

      <div className="form-layout">
        <div className="input-group">
          <label>Date Worked:</label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            placeholderText="Select a date"
            className="form-input"
            maxDate={new Date()}
          />
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Hours:</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 8"
            className="form-input"
            min="0"
          />
        </div>

        <button className="appointment-btn" style={{ marginTop: '20px' }} onClick={handleAdd}>
          ➕ Add Entry
        </button>
      </div>

      {logs.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px' }}>📋 Logged Hours</h3>
          <ul className="payments-list">
            {logs.map((log, idx) => (
              <li key={idx}>
                <strong>{log.date}</strong> — {log.hours} hour{log.hours !== 1 ? 's' : ''}
              </li>
            ))}
          </ul>

          <button
            className="appointment-btn"
            style={{ marginTop: '20px', backgroundColor: '#4caf50' }}
            onClick={handleSendToHR}
          >
            📤 Send to HR
          </button>
        </>
      )}
    </div>
  );
};

export default LogHours;
