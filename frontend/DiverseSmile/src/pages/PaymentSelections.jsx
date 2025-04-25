import React from 'react';
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/PaymentSelection.css";

const PaymentSelection = () => {
    const totalAmount = 370.00;
    // This is for selecting payment options
    return (
        <div className="dashboard-page">
            <Sidebar />
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Payment Portal</h1>
                    <p>Complete your treatment payments here</p>
                </header>
                <div className="payment-container">
                    <div className="payment-card">
                        <h3>Amount Due</h3>
                        <div className="total-amount">${totalAmount.toFixed(2)}</div>
                        
                        <div className="payment-notice">
                            <div className="notice-icon">i</div>
                            <div className="notice-content">
                                <h4>Payment Guidelines</h4>
                                <ul>  
                                    <li>Payment secures your appointment</li>
                                    <li>Payments are final and no refunds are provided</li>
                                    <li>Insurance claims must be filed separately</li>
                                </ul>
                            </div>
                        </div>
                        
                        <Link to="/payment-process" className="pay-button">
                            Proceed to Payment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSelection;