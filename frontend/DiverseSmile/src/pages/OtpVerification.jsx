import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OtpVerification.css";

const OtpVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        const value = element.value;
        if (/^\d$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== "" && element.nextSibling) {
                element.nextSibling.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const code = otp.join("");
        const email = localStorage.getItem('resetEmail');
        const role = localStorage.getItem('userRole');

        if (!email || !role) {
            setError("Session expired. Please start the reset process again.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3300/api/auth/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code, role }) // Include role in verification
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid verification code');
            }

            localStorage.setItem('resetCode', code);
            navigate("/create-new-password");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        setError("");
        const email = localStorage.getItem('resetEmail');
        const role = localStorage.getItem('userRole');

        if (!email || !role) {
            setError("Session expired. Please start the reset process again.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3300/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    role,
                    firstName: "", // These might be needed by your backend
                    lastName: ""
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend code');
            }

            alert("New verification code sent!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-verification-page">
            <div className="otp-verification-container">
                <h2>OTP Verification</h2>
                <p>Please enter the 6-digit code sent to your email.</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="otp-form">
                    <div className="otp-input-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="otp-input-box"
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="otp-submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;