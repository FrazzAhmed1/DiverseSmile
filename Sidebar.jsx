import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Patient Dashboard</h2>
            <ul>
                <li><Link to="/patient-dashboard">Dashboard</Link></li>
                <li><Link to="/appointments">Appointments</Link></li>
                <li><Link to="/payments">Payments</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;