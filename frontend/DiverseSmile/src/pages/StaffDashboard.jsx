// pages/StaffDashboard.jsx
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return <p>📅 This is your schedule section (coming soon!)</p>;
      case "logHours":
        return <p>🕒 Here you can log your work hours.</p>;
      case "payroll":
        return <p>💰 Payroll will be calculated here.</p>;
      case "appointmentHistory":
        return <p>📖 Appointment history section.</p>;
      case "patientHistory":
        return <p>🧾 Patient history section.</p>;
      default:
        return (
          <div>
            <h2>Welcome, {user.firstName || "sunshine"}!</h2>
            <p>Here’s what you can do today:</p>
            <ul style={{ textAlign: "left", marginTop: "20px" }}>
              <li>📅 View and manage your schedule</li>
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
    window.location.href = "/staff-login";
  };

  return (
    <div className="dashboard-page-wrapper">
      <div className="staff-dashboard-wrapper">
        <div className="sidebar">
          <h2>Staff Panel</h2>
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
                className={activeTab === "appointmentHistory" ? "active-tab" : ""}
                onClick={() => setActiveTab("appointmentHistory")}
              >
                Appointment History
              </button>
            </li>
            <li>
              <button
                className={activeTab === "patientHistory" ? "active-tab" : ""}
                onClick={() => setActiveTab("patientHistory")}
              >
                Patient's History
              </button>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>

        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StaffDashboard;
