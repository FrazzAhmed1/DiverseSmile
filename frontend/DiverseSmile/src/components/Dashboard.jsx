// components/Dashboard.jsx
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = ({ role }) => {
    // gets user data from local storage or else uses empty object 
    const user = JSON.parse(localStorage.getItem("user")) || {};

    return (
        <div className="dashboard-container">
            <Link to="/" className="go-back-button">
                ← Back to Home
            </Link>
            
            <h1>Welcome, {user.firstName || role}!</h1>
            <p>This is your {role} dashboard.</p>
        </div>
    );
};

export default Dashboard;
