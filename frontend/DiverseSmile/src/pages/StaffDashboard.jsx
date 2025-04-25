import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "../styles/Dashboard.css";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [logs, setLogs] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  const staffName = user.firstName || "Staff Member";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "logHours") {
          const res = await axios.get("http://localhost:3300/api/login-logs", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLogs(res.data);
        } else if (activeTab === "pendingAppointments") {
          const res = await axios.get("http://localhost:3300/api/appointments/pending", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPendingAppointments(res.data);
        } else if (activeTab === "schedule") {
          const res = await axios.get("http://localhost:3300/api/appointments/staff", {
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
      await axios.delete(`http://localhost:3300/api/login-logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs((prev) => prev.filter((log) => log._id !== id));
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  const confirmAppointment = async (id) => {
    try {
      await axios.put(`http://localhost:3300/api/appointments/${id}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingAppointments(pendingAppointments.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Failed to confirm appointment:", err);
    }
  };

  const completeAppointment = async (id) => {
    try {
      await axios.put(`http://localhost:3300/api/appointments/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyAppointments(myAppointments.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Failed to complete appointment:", err);
    }
  };

  const cancelClaimedAppointment = async (id) => {
    try {
      await axios.put(`http://localhost:3300/api/appointments/${id}/staff-cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyAppointments(myAppointments.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  const calculateTotalDuration = () => {
    const total = logs.reduce((acc, log) => {
      const [h, m, s] = log.duration.split(":").map(Number);
      return acc + h * 3600 + m * 60 + s;
    }, 0);

    const hours = String(Math.floor(total / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const seconds = String(total % 60).padStart(2, "0");
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
                  <p><strong>{app.patientId.firstName} {app.patientId.lastName}</strong> - {format(new Date(app.date), "PPP")} at {app.time}</p>
                  <button onClick={() => completeAppointment(app._id)}>✅ Complete</button>
                  <button onClick={() => cancelClaimedAppointment(app._id)} style={{ backgroundColor: "#dc3545", marginLeft: "10px" }}>❌ Cancel</button>
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
                  <p><strong>{app.patientId.firstName} {app.patientId.lastName}</strong> - {format(new Date(app.date), "PPP")} at {app.time}</p>
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
            <Link to="/login-hours">
              <button className="go-to-login-hours">⏱ Go to Clock In/Out Page</button>
            </Link>
            <div className="submitted-data" style={{ marginTop: "20px" }}>
              <h3>🧾 Your Logged Hours</h3>
              {logs.length === 0 ? (
                <p>No logs yet.</p>
              ) : (
                <>
                  <p style={{ marginBottom: "10px" }}>🧮 <strong>Total Duration:</strong> {calculateTotalDuration()}</p>
                  {logs.map((log) => (
                    <div key={log._id} className="submission-entry">
                      <p>
                        <strong>Name:</strong> {staffName} | <strong>Date:</strong> {format(new Date(log.date), "MMMM d, yyyy")} | <strong>Duration:</strong> {log.duration}
                      </p>
                      <button
                        className="clock-out-button"
                        style={{ backgroundColor: "#dc3545", marginTop: "5px" }}
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
            <h2>Payroll</h2>
            <p>💰 Payroll will be calculated here.</p>
          </div>
        );
      case "appointmentHistory":
        return (
          <div className="dashboard-tips">
            <h2>Appointment History</h2>
            <p>📖 Appointment history section.</p>
          </div>
        );
      case "patientHistory":
        return (
          <div className="dashboard-tips">
            <h2>Patient History</h2>
            <Link to="/patient-history">
              <button className="go-to-login-hours">Patient's History Page</button>
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
            <li><button className={activeTab === "welcome" ? "active-tab" : ""} onClick={() => setActiveTab("welcome")}>Welcome</button></li>
            <li><button className={activeTab === "schedule" ? "active-tab" : ""} onClick={() => setActiveTab("schedule")}>Your Schedule</button></li>
            <li><button className={activeTab === "pendingAppointments" ? "active-tab" : ""} onClick={() => setActiveTab("pendingAppointments")}>Pending Appointments</button></li>
            <li><button className={activeTab === "logHours" ? "active-tab" : ""} onClick={() => setActiveTab("logHours")}>Log in Hours</button></li>
            <li><button className={activeTab === "payroll" ? "active-tab" : ""} onClick={() => setActiveTab("payroll")}>Calculate Payroll</button></li>
            <li><button className={activeTab === "appointmentHistory" ? "active-tab" : ""} onClick={() => setActiveTab("appointmentHistory")}>Appointment History</button></li>
            <li><button className={activeTab === "patientHistory" ? "active-tab" : ""} onClick={() => setActiveTab("patientHistory")}>Patient's History</button></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
        <div className="dashboard-main">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StaffDashboard;