// src/components/AdminSignupForm.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/SignupForm.css";

const AdminSignupForm = ({ onSubmit, message, privateKey, type }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    privateKey: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="signup-container">
      <Link to="/" className="go-back-button">Go Back</Link>
      <h2>{type === "signup" ? "Admin Signup" : "Admin Login"}</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

        {type === "signup" && (
          <>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          </>
        )}

        {type === "login" && (
          <input type="text" name="privateKey" placeholder="Private Key" onChange={handleChange} required />
        )}

        <button type="submit">{type === "signup" ? "Sign Up" : "Login"}</button>
      </form>

      {privateKey && (
        <>
          <div className="message">
            <p><strong>Your Private Key (save this!):</strong></p>
            <code>{privateKey}</code>
          </div>
          <p className="switch-role-text">
            Ready to login? <Link to="/admin/login" className="switch-role-link">Click here</Link>
          </p>
        </>
      )}


      {message && <div className="message">{message}</div>}

      {type === "signup" ? (
        <p className="switch-role-text">
          Already have an account? <Link to="/admin/login" className="switch-role-link">Login</Link>
        </p>
      ) : (
        <p className="switch-role-text">
          Don't have an account? <Link to="/admin/signup" className="switch-role-link">Sign up</Link>
        </p>
      )}
    </div>
  );
};

export default AdminSignupForm;