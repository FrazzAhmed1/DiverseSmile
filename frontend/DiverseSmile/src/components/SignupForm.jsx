import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/SignupForm.css";

// storing form data holding key information
const SignupForm = ({ role, onSubmit, message }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
 // handles changes for form inputs for the sign up form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 // handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Go Back Button */}
        <Link to="/" className="go-back-button">
          Go Back
        </Link>

        <h2>{role === "patient" ? "Patient Signup" : "Staff Signup"}</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="nav-btn">Sign Up</button>

          {/* Switch Role Link */}
          <p className="switch-role-text">
            {role === "patient" ? (
              <>
                Are you a staff member?{" "}
                <Link to="/staff-signup" className="switch-role-link">
                  Sign up as staff
                </Link>
              </>
            ) : (
              <>
                Are you a patient?{" "}
                <Link to="/patient-signup" className="switch-role-link">
                  Sign up as patient
                </Link>
              </>
            )}
          </p>
          {/* Login Link */}
          <p className="switch-role-text">
            Already have an account?{" "}
            <Link
              to={role === "patient" ? "/patient-login" : "/staff-login"}
              className="switch-role-link"
            >
              Login as {role}
            </Link>
          </p>

          {/* Message */}
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
