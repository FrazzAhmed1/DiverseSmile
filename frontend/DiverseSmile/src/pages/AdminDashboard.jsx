import React, { useState } from "react";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("home");
    const [searchQuery, setSearchQuery] = useState("");
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const adminName = user.firstName ? `${user.firstName} ${user.lastName}` : "Administrator";
    // display name of logged in person
    const PerformanceChart = ({ attended = 82, cancelled = 18 }) => (
        <div className="chart-container">
            <div className="main-pie">
                <div className="pie" style={{
                    background: `conic-gradient(#2a5e5e ${attended}%, #ff6b6b 0)`
                }}>
                    <div className="pie-center">
                        <span>{attended}%</span>
                        <p>Attendance Rate</p>
                    </div>
                </div>
                <div className="chart-stats">
                    <div className="stat">
                        <div className="stat-value">{100 - cancelled}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value cancelled">{cancelled}</div>
                        <div className="stat-label">Cancelled</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="professional-sidebar">
                <div className="sidebar-header">
                    <h1>CLINIC<span>ANALYTICS</span></h1>
                    <div className="admin-profile">
                        <div className="avatar">{(adminName[0] || 'A').toUpperCase()}</div>
                        <div className="admin-info">
                            <h2>{adminName}</h2>
                            <p>System Administrator</p>
                        </div>
                    </div>
                </div>

                <nav className="main-nav">
                    <button
                        className={`nav-item ${activeTab === "home" ? "active" : ""}`}
                        onClick={() => setActiveTab("home")}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`nav-item ${activeTab === "performance" ? "active" : ""}`}
                        onClick={() => setActiveTab("performance")}
                    >
                        Staff Performance
                    </button>
                    <button
                        className={`nav-item ${activeTab === "hours" ? "active" : ""}`}
                        onClick={() => setActiveTab("hours")}
                    >
                        Attendance
                    </button>
                    <button
                        className={`nav-item ${activeTab === "kpi" ? "active" : ""}`}
                        onClick={() => setActiveTab("kpi")}
                    >
                        KPIs
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="logout-btn"
                        onClick={() => {
                            localStorage.removeItem("user");
                            window.location.href = "/admin-login";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="main-content-area">
                {activeTab === "home" && (
                    <div className="overview-screen">
                        <div className="welcome-banner">
                            <h1>Administration Dashboard</h1>
                            <p>Comprehensive management platform</p>
                        </div>  
                        <div className="animated-graphic"> {/* graphic for dashboard page, light and smooth*/}
                            <svg viewBox="0 0 500 300">
                                <path
                                    className="wave"
                                    d="M0,150 C150,200 350,50 500,150 L500,300 L0,300 Z"
                                ></path>
                                <path
                                    className="pulse"
                                    d="M100,200 L150,150 L200,200 L250,130 L300,170 L350,120 L400,190"
                                ></path>
                                <circle className="dot" cx="250" cy="150" r="8" />
                            </svg>
                        </div>
                    </div>
                )}

                {activeTab === "performance" && (
                    <div className="performance-screen">
                        <div className="analysis-header">
                            <h1>Staff Performance Analytics</h1>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search staff member..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="search-btn">Search</button>
                            </div>
                        </div>
                        <div className="chart-section">
                            <PerformanceChart attended={85} cancelled={15} />
                        </div>
                    </div>
                )}

                {activeTab === "hours" && (
                    <div className="attendance-screen">
                        <h1>Attendance Overview</h1>
                        <div className="attendance-card">
                            <div className="hours-display">
                                <span>38.5</span>
                                <p>Average Weekly Hours</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "kpi" && (
                    <div className="kpi-screen">
                        <h1>Key Performance Indicators</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;