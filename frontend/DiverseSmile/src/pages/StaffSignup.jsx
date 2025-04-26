import { useState } from "react";
import SignupForm from "../components/SignupForm";

const StaffSignup = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/staff/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Staff registered successfully!");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <SignupForm role="staff" onSubmit={handleSubmit} message={message} />
    </div>
  );
};

export default StaffSignup;
