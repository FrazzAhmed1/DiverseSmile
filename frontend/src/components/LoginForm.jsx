import { Link } from "react-router-dom";
import "../styles/LoginForm.css";

const LoginForm = ({ role, onSubmit, error }) => {
    return (
        <div className="login-container">
            <Link to="/" className="go-back-button">
                Go Back
            </Link>

            <h2>{role === "patient" ? "Patient Login" : "Staff Login"}</h2>
            <form className="login-form" onSubmit={onSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                    />
                </div>
                <button type="submit">Login</button>

                <p style={{ textAlign: "center", marginTop: "10px" }}>
                   Forgot Password?{" "}
                   <Link to="/forgot-password" style={{ color: "blue", textDecoration: "underline" }}>
                       Click Here
                  </Link>
                </p>

                <p className="switch-role-text">
                    Don't have an account?{" "}
                    <Link
                        to={role === "patient" ? "/patient-signup" : "/staff-signup"}
                        className="switch-role-link"
                    >
                        Sign up as {role}
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
