import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/PaymentSuccess.css";

const PaymentConfirmation = () => {
    const location = useLocation();
    const [paymentDetails, setPaymentDetails] = useState({
        amount: 75.00,
        date: new Date().toLocaleDateString(),
        appointmentId: ''
    });

    useEffect(() => {
        if (location.state) {
            setPaymentDetails({
                amount: location.state.amount || 75.00,
                date: new Date().toLocaleDateString(),
                appointmentId: location.state.appointmentId || ''
            });
        }
    }, [location]);

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
                        <p className="confirmation-amount">${paymentDetails.amount.toFixed(2)}</p>

                        <div className="confirmation-details">
                            <div className="detail-row">
                                <span>Date:</span>
                                <span>{paymentDetails.date}</span>
                            </div>
                            <div className="detail-row">
                                <span>Transaction ID:</span>
                                <span>{Math.random().toString(36).substring(2, 15)}</span>
                            </div>
                        </div>

                        <div className="confirmation-actions">
                            <Link to="/patient-dashboard" className="dashboard-button">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;