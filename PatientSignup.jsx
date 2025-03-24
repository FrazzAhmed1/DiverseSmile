import { useState } from "react";
import SignupForm from "../components/SignupForm";

const PatientSignup = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/patients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Patient registered successfully!");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <SignupForm role="patient" onSubmit={handleSubmit} message={message} />
    </div>
  );
};

export default PatientSignup;