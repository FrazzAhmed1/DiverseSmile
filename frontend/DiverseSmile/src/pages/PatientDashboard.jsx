import Sidebar from "../components/Sidebar";
import Payments from "../components/Tips";
import "../styles/Dashboard.css";

const PatientDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    console.log("User :", user); 
    console.log("user.firstName:", user.firstName); 
    const patientName = user.firstName && user.firstName.trim() ? user.firstName : "Patient";
    console.log("Patient Name:", patientName); 

    return (
        <div className="dashboard-page">
            <Sidebar />
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Welcome, {patientName}!</h1>
                    <p>Your personalized dashboard for managing appointments, payments, and more.</p>
                </header>
                <section className="dashboard-content">
                    <Payments />
                </section>
            </div>
        </div>
    );
};

export default PatientDashboard;