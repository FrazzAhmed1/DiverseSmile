import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Sidebar = ({ handleLogout }) => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Patient Dashboard</h2>
            <ul className="sidebar-links">
                <li><Link to="/schedule">📅 Appointments</Link></li>
                <li><Link to="/payments">💳 Payments</Link></li>
                <li><Link to="/patient-profile">👤 Profile</Link></li>
                <li>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault(); 
                            handleLogout(); // Call the logout function
                        }}
                        data-discover="true"
                    >
                        🚪 Logout
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;