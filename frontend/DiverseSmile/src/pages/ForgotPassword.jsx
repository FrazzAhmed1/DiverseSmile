import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "patient" // Default to patient
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset code');
            }

            // Store email AND role for the next steps
            localStorage.setItem('resetEmail', formData.email);
            localStorage.setItem('userRole', formData.role);
            navigate("/otp-verification");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <h2>Forgot Password</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <label>I am a:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="role-select"
                        >
                            <option value="patient">Patient</option>
                            <option value="staff">Staff Member</option>
                        </select>
                    </div>
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
                    <button
                        type="submit"
                        className="nav-btn"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
