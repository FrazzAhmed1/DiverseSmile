// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSignupForm from "../components/AdminSignupForm";

const AdminLogin = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    // handles admin login submission form
    const handleLogin = async (loginData) => {
        try {
            // send login request to backend API
            const response = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginData.email,
                    privateKey: loginData.privateKey
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Store token and user data if successful
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({
                    id: data._id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: "admin"
                }));
                
                navigate("/admin-dashboard");
            } else {
                // display error message
                setMessage(data.message || "Invalid credentials");
            }
        } catch (error) {
            // other issues or network issue 
            setMessage("Login failed. Please try again.");
        }
    };

    return (
        <div>
            <AdminSignupForm
                onSubmit={handleLogin}
                message={message}
                type="login"
            />
        </div>
    );
};

export default AdminLogin;
