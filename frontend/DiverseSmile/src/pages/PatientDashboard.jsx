import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import Sidebar from "../components/Sidebar";
import Tips from "../components/Tips";
import "../styles/Dashboard.css";
import axios from "axios";

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState("welcome"); 
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const patientName = user.firstName && user.firstName.trim() ? user.firstName : "Patient";

    const handleLogout = async () => {
        try {
            console.log("Attempting to log out...");
            const response = await axios.post("http://localhost:5000/api/patients/logout");

            if (response.status === 200) {
                console.log("Logout successful");
                // Clear user data from localStorage
                localStorage.removeItem("user");
                localStorage.removeItem("token"); 

                // Redirect to the homepage
                navigate("/");
            } else {
                console.error("Logout failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error logging out:", error.response?.data?.message || error.message);
            // Clear storage and redirect to homepage as a fallback
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/");
        }
    };

    return (
        <div className="dashboard-page">
            <Sidebar handleLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Welcome, {patientName}!</h1>
                    <p>Your personalized dashboard for managing appointments, payments, and more.</p>
                </header>
                <section className="dashboard-content">
                    <Tips />
                </section>
            </div>
        </div>
    );
};

export default PatientDashboard;
