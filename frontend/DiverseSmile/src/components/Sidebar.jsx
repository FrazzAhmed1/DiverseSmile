import React from "react";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

const Sidebar = ({ handleLogout, activeTab, setActiveTab }) => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Patient Dashboard</h2>
            <ul className="sidebar-links">
                <li>
                    <Link
                        to="/patient-dashboard"
                        className={activeTab === "welcome" ? "active" : ""}
                        onClick={() => setActiveTab("welcome")}

                    >
                        🏠 Welcome
                    </Link>

                </li>
                <li>
                    <Link to="/schedule">📅 Appointments</Link>
                </li>
                <li>
                    <Link to="/payments">
                        💳 Payments
                    </Link>
                </li>
                <li>
                    <Link to="/patient-profile">👤 Profile</Link>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        🚪 Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;