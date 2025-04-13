/DiverseSmile/frontend/DiverseSmile/src/components/Appointments.jsx
import React from "react";
import "../styles/Dashboard.css";

const Appointments = () => {
    return (
        <div className="appointments">
            <h2>Your Appointments</h2>
            <ul>
                <li>Cleaning - 10/4/2025</li>
                <li>Filling up - 11/4/2025</li>
                <li>Checkup - 1/4/2025</li>
            </ul>
        </div>
    );
};

export default Appointments;