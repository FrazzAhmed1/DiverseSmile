import React from "react";
import Sidebar from "../components/Sidebar";
import Appointments from "../components/Appointments";
import Payments from "../components/Payments";
import "../styles/Dashboard.css";

const PatientDashboard = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Welcome, a Patient!</h1>
                <div className="dashboard-sections">
                    <Appointments />
                    <Payments />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;