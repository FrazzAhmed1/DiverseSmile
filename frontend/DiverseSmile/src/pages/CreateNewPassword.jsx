import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateNewPassword.css";

const CreateNewPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError("");

        const email = localStorage.getItem('resetEmail');
        const code = localStorage.getItem('resetCode');
        const role = localStorage.getItem('userRole');

        if (!email || !code || !role) {
            setError("Session expired. Please start the reset process again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    code,
                    newPassword: password,
                    role // Include role in reset request
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            // Clear reset data from storage
            localStorage.removeItem('resetEmail');
            localStorage.removeItem('resetCode');
            localStorage.removeItem('userRole');

            // Redirect to appropriate login based on role
            const loginRoute = role === 'patient' ? '/patient-login' : '/staff-login';
            alert("Password Changed Successfully!");
            navigate(loginRoute);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-password-page">
            <div className="create-password-container">
                <h2>Create New Password</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="create-password-form">
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        className="create-password-button"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNewPassword;