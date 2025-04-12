// pages/AdminDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/admin-login");
        }
    }, [user, navigate]);

    return <Dashboard role="admin" />;
};

export default AdminDashboard;
