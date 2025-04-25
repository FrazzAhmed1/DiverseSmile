import React from 'react';
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/PaymentSuccess.css";

const PaymentConfirmation = () => {
    // This component is for displaying the payment confirmation
    return (
        <div className="dashboard-page">
            <Sidebar />
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Payment Complete</h1>
                    <p>Your transaction was processed successfully</p>
                </header>
                <div className="confirmation-container">
                    <div className="confirmation-card">
                        <div className="confirmation-icon">✓</div>
                        <h2>Payment Received</h2>
                        <p className="confirmation-amount">$370.00</p>
                        
                        <div className="confirmation-details">
                            <div className="detail-row">
                                <span>Date:</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="confirmation-actions">
                            <Link to="/patient-dashboard" className="dashboard-button">Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;