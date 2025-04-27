// src/pages/StaffDashboard.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Payroll from "./Payroll";
import axios from "axios";
import { format } from "date-fns";
import "../styles/Dashboard.css";

const API_BASE = "http://localhost:5000";

const StaffDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("welcome");
  const [logs, setLogs] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const staffName = user.firstName || "Staff Member";

  // If we navigated here with a tab in state, select it
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Fetch data when activeTab changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "logHours") {
          const res = await axios.get(`${API_BASE}/api/login-logs`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLogs(res.data);
        } else if (activeTab === "pendingAppointments") {
          const res = await axios.get(`${API_BASE}/api/appointments/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPendingAppointments(res.data);
        } else if (activeTab === "schedule") {
          const res = await axios.get(`${API_BASE}/api/appointments/staff`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMyAppointments(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [activeTab, token]);

  const deleteLog = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/login-logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs((prev) => prev.filter((log) => log._id !== id));
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  const confirmAppointment = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/api/appointments/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingAppointments((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Failed to confirm appointment:", err);
    }
  };

  const completeAppointment = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/api/appointments/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyAppointments((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Failed to complete appointment:", err);
    }
  };

  const cancelClaimedAppointment = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/api/appointments/${id}/staff-cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyAppointments((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  const calculateTotalDuration = () => {
    const totalSeconds = logs.reduce((sum, log) => {
      const [h, m, s] = log.duration.split(":").map(Number);
      return sum + h * 3600 + m * 60 + s;
    }, 0);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <div className="dashboard-tips">
            <h2>Your Claimed Appointments</h2>
            {myAppointments.length === 0 ? (
              <p>No appointments in your schedule</p>
            ) : (
              myAppointments.map((app) => (
                <div key={app._id} className="submission-entry">
                  <p>
                    <strong>
                      {app.patientId.firstName} {app.patientId.lastName}
                    </strong>{" "}
                    — {format(new Date(app.date), "PPP")} at {app.time}
                  </p>
                  <button onClick={() => completeAppointment(app._id)}>✅ Complete</button>
                  <button
                    onClick={() => cancelClaimedAppointment(app._id)}
                    style={{ backgroundColor: "#dc3545", marginLeft: "10px" }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        );

      case "pendingAppointments":
        return (
          <div className="dashboard-tips">
            <h2>Pending Appointments</h2>
            {pendingAppointments.length === 0 ? (
              <p>No pending appointments</p>
            ) : (
              pendingAppointments.map((app) => (
                <div key={app._id} className="submission-entry">
                  <p>
                    <strong>
                      {app.patientId.firstName} {app.patientId.lastName}
                    </strong>{" "}
                    — {format(new Date(app.date), "PPP")} at {app.time}
                  </p>
                  <button onClick={() => confirmAppointment(app._id)}>✅ Claim</button>
                </div>
              ))
            )}
          </div>
        );

      case "logHours":
        return (
          <div className="dashboard-tips">
            <h2>Log Hours</h2>
            <div className="log-hours-actions">
              <Link to="/login-hours">
                <button className="go-to-login-hours">⏱ Go to Clock In/Out Page</button>
              </Link>
              <Link to="/manual-log-hours">
                <button className="manual-add-hours-btn">📝 Manually Add Hours</button>
              </Link>
            </div>
            <div className="submitted-data">
              <h3>🧾 Your Logged Hours</h3>
              {logs.length === 0 ? (
                <p>No logs yet.</p>
              ) : (
                <>
                  <p className="total-hours-summary">
                    🧮 Total Duration: {calculateTotalDuration()}
                  </p>
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className={`submission-entry${log.isManual ? " manual-entry" : ""}`}
                    >
                      <p>
                        <strong>Name:</strong> {staffName} |{" "}
                        <strong>Date:</strong> {format(new Date(log.date), "MMMM d, yyyy")} |{" "}
                        <strong>Duration:</strong> {log.duration}
                        {log.isManual && <span className="manual-label">Manually Added</span>}
                      </p>
                      <button
                        className="clock-out-button"
                        onClick={() => deleteLog(log._id)}
                      >
                        ❌ Delete
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );

      case "payroll":
        return (
          <div className="dashboard-tips">
            <Payroll hourlyRate={145} taxRate={0.1} />
          </div>
        );

      case "patientHistory":
        return (
          <div className="dashboard-tips">
            <h2>Patient History</h2>
            <Link to="/patient-history">
              <button className="go-to-login-hours">Patient’s History Page</button>
            </Link>
          </div>
        );

      default:
        return (
          <div className="dashboard-header">
            <h2>Welcome, {staffName}!</h2>
            <p>Here's what you can do today:</p>
            <ul className="payments-list">
              <li>🗕️ View and manage your schedule</li>
              <li>🕒 Log your working hours</li>
              <li>💰 Check your payroll</li>
              <li>📖 Review appointments and patients</li>
            </ul>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/staff-login";
  };

  return (
    <div className="dashboard-page-wrapper">
      <div className="staff-dashboard-wrapper">
        <div className="sidebar">
          <h2>Staff Panel</h2>
          <p className="staff-name">{staffName}</p>
          <ul>
            <li>
              <button
                className={activeTab === "welcome" ? "active-tab" : ""}
                onClick={() => setActiveTab("welcome")}
              >
                Welcome
              </button>
            </li>
            <li>
              <button
                className={activeTab === "schedule" ? "active-tab" : ""}
                onClick={() => setActiveTab("schedule")}
              >
                Your Schedule
              </button>
            </li>
            <li>
              <button
                className={activeTab === "pendingAppointments" ? "active-tab" : ""}
                onClick={() => setActiveTab("pendingAppointments")}
              >
                Pending Appointments
              </button>
            </li>
            <li>
              <button
                className={activeTab === "logHours" ? "active-tab" : ""}
                onClick={() => setActiveTab("logHours")}
              >
                Log in Hours
              </button>
            </li>
            <li>
              <button
                className={activeTab === "payroll" ? "active-tab" : ""}
                onClick={() => setActiveTab("payroll")}
              >
                Calculate Payroll
              </button>
            </li>
            <li>
              <button
                className={activeTab === "patientHistory" ? "active-tab" : ""}
                onClick={() => setActiveTab("patientHistory")}
              >
                Patient’s History
              </button>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
        <div className="dashboard-main">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StaffDashboard;
