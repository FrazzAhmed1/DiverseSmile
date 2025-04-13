// components/Dashboard.jsx
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const appointments = [
    {
        date: "3/6/2025",
        patients: [
            { name: "Sam S.", time: "12:30PM", purpose: "Cavity" },
            { name: "Happy T.", time: "3:00PM", purpose: "Cavity" },
        ],
    },
    {
        date: "3/7/2025",
        patients: [
            { name: "Kat K.", time: "11:00AM", purpose: "Cleaning" },
        ],
    },
];

const Dashboard = ({ role }) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <span role="img" aria-label="tooth">🦷</span>
                    <h1>DiverseSmile</h1>
                </div>
                <div className="header-right">Doctor’s Name</div>
            </header>

            <Link to="/" className="go-back-button">
                ← Back to Home
            </Link>

            <div className="welcome">
                <h1>Welcome, {user.firstName || role}!</h1>
                <p>This is your {role} dashboard.</p>
            </div>

            <div className="dashboard-main">
                {/* Sidebar */}
                <aside className="sidebar">
                    <button>Your Schedule</button>
                    <button>Log in hours</button>
                    <button>Calculate Payroll</button>
                    <button>Appointment History</button>
                    <button>Patient’s History</button>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {appointments.map((day, idx) => (
                        <div key={idx} className="appointment-date">
                            <h2>Date: {day.date}</h2>
                            {day.patients.map((p, i) => (
                                <div key={i} className="appointment-card">
                                    <span>
                                        Patient’s Name: <strong>{p.name}</strong> | Time: <strong>{p.time}</strong> | For: <strong>{p.purpose}</strong>
                                    </span>
                                    <button className="check-button">✅</button>
                                </div>
                            ))}
                        </div>
                    ))}
                </main>
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <div>
                    <h3>About US</h3>
                    <p>Our Staff</p>
                </div>
                <div>
                    <h3>Info</h3>
                    <p>6000 J Street,<br />Sacramento, CA</p>
                    <p>diversesmile@gmail.com</p>
                    <p>(916)-949-9095</p>
                </div>
                <div>
                    <h3>Account</h3>
                    <p>My Account</p>
                    <p>Create an account</p>
                    <p>Appointment</p>
                </div>
                <div>
                    <h3>Quick Link</h3>
                    <p>FAQ</p>
                    <p>Help/Support</p>
                </div>
                <div>
                    <h3>Home Page</h3>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
