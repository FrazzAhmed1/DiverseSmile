// src/pages/AdminSignup.jsx
import { useState } from "react";
import AdminSignupForm from "../components/AdminSignupForm";

const AdminSignup = () => {
    const [privateKey, setPrivateKey] = useState(null);
    const [message, setMessage] = useState("");

    const handleSignup = async (formData) => {
        try {
            const response = await fetch("http://localhost:3300/api/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setPrivateKey(data.privateKey);
                setMessage("Admin registered! Save your private key above.");
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            setMessage("An error occurred.");
        }
    };

    return (
        <div>
            <AdminSignupForm
                onSubmit={handleSignup}
                message={message}
                privateKey={privateKey}
                type="signup"
            />
        </div>
    );
};

export default AdminSignup;
