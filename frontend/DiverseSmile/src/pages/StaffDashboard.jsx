import React, { useState } from "react";
import "../styles/Dashboard.css";


const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState("welcome");
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const staffName = user.firstName || "Staff Member";

    const renderContent = () => {
        switch (activeTab) {
            case "schedule":
                return (
                    <div className="dashboard-tips">
                        <h2>Your Schedule</h2>
                        <p>📅 This is your schedule section (coming soon!)</p>
                    </div>
                );
            case "logHours":
                return (
                    <div className="dashboard-tips">
                        <h2>Log Hours</h2>
                        <p>🕒 Here you can log your work hours.</p>
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
                        <p>🧾 Patient history section.</p>
                    </div>
                );
            default:
                return (
                    <div className="dashboard-header">
                        <h2>Welcome, {staffName}!</h2>
                        <p>Here's what you can do today:</p>
                        <ul className="payments-list">
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
                <div className="dashboard-main">{renderContent()}</div>
            </div>
        </div>
    );
};

export default StaffDashboard;
