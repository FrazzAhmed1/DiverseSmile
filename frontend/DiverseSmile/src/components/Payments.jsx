import React from "react";
import "../styles/Dashboard.css";

const Payments = () => {
    return (
        <div className="payments">
            <h2>Your Payments</h2>
            <ul>
                <li>Payment 1: $100 - Payment made on 10/4/2025</li>
                <li>Payment 2: $200 - Paid on 15/12/2025</li>
                <li>Payment 3: $150 - Paid on 20/12/2025</li>
            </ul>
        </div>
    );
};

export default Payments;