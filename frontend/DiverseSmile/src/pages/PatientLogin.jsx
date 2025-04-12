// pages/PatientLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const PatientLogin = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const formData = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        try {
            const response = await fetch(
                "http://localhost:5000/api/patient-auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Store user data and token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role
            }));

            // Redirect to dashboard
            navigate("/patient-dashboard");
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        }
    };

    return (
        <div>
            <LoginForm
                role="patient"
                onSubmit={handleSubmit}
                error={error}
            />
        </div>
    );
};

export default PatientLogin;