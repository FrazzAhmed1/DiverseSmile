import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateNewPassword.css";

const CreateNewPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        alert("Password Changed Successfully!");
        navigate("/patient-login"); // Redirect to the login page
    };

    return (
        <div className="create-password-page">
            <div className="create-password-container">
                <h2>Create New Password</h2>
                <form onSubmit={handleSubmit} className="create-password-form">
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="create-password-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNewPassword;