import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OtpVerification.css";

const OtpVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Entered OTP:", otp.join(""));
        navigate("/create-new-password");
    };

    const handleResendCode = () => {
        console.log("Resend OTP code");
    };

    return (
        <div className="otp-verification-page">
            <div className="otp-verification-container">
                <h2>OTP Verification</h2>
                <p>Please enter the 6-digit code sent to your email.</p>
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
                    <button type="submit" className="otp-submit-button">
                        Enter
                    </button>
                </form>
                <button onClick={handleResendCode} className="resend-code-button">
                    Resend Code
                </button>
            </div>
        </div>
    );
};

export default OtpVerification;