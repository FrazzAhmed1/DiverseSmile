// src/pages/AdminLogin.jsx
import { useState } from "react";
import AdminSignupForm from "../components/AdminSignupForm";

const AdminLogin = () => {
  const [message, setMessage] = useState("");

  const handleLogin = async (loginData) => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Login successful!");
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setMessage("Login error.");
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

