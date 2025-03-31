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
                {type === "signup" ? (
                    <>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Private Key</label>
                            <input
                                type="password"
                                name="privateKey"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit">{type === "signup" ? "Sign Up" : "Login"}</button>
            </form>

            {type === "signup" && (
                <>
                    {privateKey && (
                        <div className="message">
                            <p><strong>Your Private Key (save this!):</strong></p>
                            <code>{privateKey}</code>
                            <p className="switch-role-text">
                                Already have an account? <Link to="/admin/login" className="switch-role-link">Login</Link>
                            </p>
                        </div>
                    )}
                    {!privateKey && (
                        <p className="switch-role-text">
                            Already have an account? <Link to="/admin/login" className="switch-role-link">Login</Link>
                        </p>
                    )}
                </>
            )}

            {type === "login" && (
                <>
                    <p className="switch-role-text">
                        Don't have an account? <Link to="/admin/signup" className="switch-role-link">Sign up</Link>
                    </p>
                    <p className="switch-role-text">
                        <Link to="/admin/forgot-password" className="switch-role-link">
                            Forgot your private key?
                        </Link>
                    </p>
                </>
            )}

            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default AdminSignupForm;
