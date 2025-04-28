import React from "react";
import "../styles/Dashboard.css";

const Tips = () => {
    return (
        <div className="payments">
            <h2 className="payments-title">Dental Care Tips</h2>
            <ul className="payments-list">
                <li>🪥 Brush your teeth twice a day with fluoride toothpaste.</li>
                <li>🩺 Schedule regular dental checkups every 6 months.</li>
                <li>🧵 Don’t forget to floss daily to remove plaque between teeth.</li>
                <li>🍎 Avoid sugary snacks and drinks to protect your teeth.</li>
                <li>💧 Stay hydrated to maintain saliva production for healthy teeth.</li>
            </ul>
        </div>
    );
};

export default Tips;