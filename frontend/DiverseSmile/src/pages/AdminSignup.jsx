// src/pages/AdminSignup.jsx
import { useState } from "react";
import AdminSignupForm from "../components/AdminSignupForm";

const AdminSignup = () => {
    // store private key after registration 
    const [privateKey, setPrivateKey] = useState(null);
    const [message, setMessage] = useState("");
    // handles admin registration form 
    const handleSignup = async (formData) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                // if successful, show private key and show success message 
                setPrivateKey(data.privateKey);
                setMessage("Admin registered! Save your private key above.");
            } else {
                // show error message 
                setMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            // for other failures or network issue
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
