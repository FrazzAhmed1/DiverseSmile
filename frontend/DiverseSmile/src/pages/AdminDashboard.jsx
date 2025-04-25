import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [staffPerformances, setStaffPerformances] = useState([]);

  const token = localStorage.getItem("token") || (JSON.parse(localStorage.getItem("user"))?.token ?? null);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const adminName = user.firstName ? `${user.firstName} ${user.lastName}` : "Administrator";

  useEffect(() => {
    if (activeTab === "performance") {
      console.log("Admin token:", token);

      axios
        .get("http://localhost:3300/api/performance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("Performance API response:", res.data);
          const data = Array.isArray(res.data) ? res.data : [];
          setStaffPerformances(data);
        })
        .catch((err) => {
          console.error("Error fetching staff performance:", err);
          setStaffPerformances([]);
        });
    }
  }, [activeTab]);

  const PerformanceChart = ({ attended = 75, cancelled = 34, confirmed = 0, completed = 0 }) => (
    <div className="chart-container">
      <div className="main-pie">
        <div
          className="pie"
          style={{
            background: `conic-gradient(#2a5e5e ${attended}%, #ff6b6b 0)`,
          }}
        >
          <div className="pie-center">
            <span>{attended}%</span>
            <p>Attendance Rate</p>
          </div>
        </div>
        <div className="chart-stats">
          <div className="stat">
            <div className="stat-value">{confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat">
            <div className="stat-value">{completed}</div>
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
          <h1>
            CLINIC<span>ANALYTICS</span>
          </h1>
          <div className="admin-profile">
            <div className="avatar">{(adminName[0] || "A").toUpperCase()}</div>
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
              localStorage.removeItem("token");
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
              <p>Management platform</p>
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
              {Array.isArray(staffPerformances) && staffPerformances.length > 0 ? (
                staffPerformances.map((perf) => (
                  <div key={perf._id} className="performance-entry">
                    <h3>
                      {perf.staffId?.firstName || 'Unnamed'} {perf.staffId?.lastName || ''}
                    </h3>
                    <PerformanceChart
                      attended={Math.round(perf.completionRate)}
                      cancelled={perf.totalAppointmentsCancelled}
                      confirmed={perf.totalAppointmentsConfirmed}
                      completed={perf.totalAppointmentsCompleted}
                    />
                  </div>
                ))
              ) : (
                <p>Loading performance data...</p>
              )}
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
