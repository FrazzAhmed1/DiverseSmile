import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/PaymentSelection.css";
import axios from 'axios';

const API_BASE = "http://localhost:5000";

const PaymentSelection = () => {
    const [payments, setPayments] = useState([]);
    const [pendingPayment, setPendingPayment] = useState(null);
    const [totalPaid, setTotalPaid] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("payments");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/patients/logout");
            if (response.status === 200) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/");
            }
        } catch (error) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/");
        }
    };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/api/payments/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Filter to only show payments for completed appointments
                const filteredPayments = response.data.filter(payment =>
                    payment.appointmentId?.status === 'completed' ||
                    payment.status === 'completed'
                );

                setPayments(filteredPayments);

                // Calculate total paid
                const paid = filteredPayments
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + p.amount, 0);
                setTotalPaid(paid);

                // Find pending payment for completed appointments
                const pending = filteredPayments.find(p =>
                    p.status === 'pending' &&
                    p.appointmentId?.status === 'completed'
                );
                setPendingPayment(pending);

                setError(null);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setError(err.response?.data?.message || 'Failed to fetch payment history');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [token]);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-main">
                    <div className="loading-spinner">Loading payment information...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-main">
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Sidebar handleLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Payment Portal</h1>
                    <p>Complete your treatment payments here</p>
                </header>

                <div className="payment-container">
                    {/* Pending Payment Card */}
                    {pendingPayment && pendingPayment.appointmentId?.status === 'completed' && (
                        <div className="payment-card">
                            <h3>Appointment Fee Due</h3>
                            <div className="total-amount">${pendingPayment.amount.toFixed(2)}</div>

                            <div className="payment-notice">
                                <div className="notice-icon">i</div>
                                <div className="notice-content">
                                    <h4>Payment Guidelines</h4>
                                    <ul>
                                        <li>Payment for completed appointment</li>
                                        <li>Payments are final and no refunds are provided</li>
                                        <li>Insurance claims must be filed separately</li>
                                    </ul>
                                </div>
                            </div>

                            <Link
                                to={`/payment-process?appointmentId=${pendingPayment.appointmentId._id}`}
                                className="pay-button"
                            >
                                Pay Appointment Fee
                            </Link>
                        </div>
                    )}

                    {/* Payment History */}
                    <div className="payment-history">
                        <h3>Payment History</h3>
                        <div className="total-paid">Total Paid: ${totalPaid.toFixed(2)}</div>

                        {payments.length > 0 ? (
                            <table className="payment-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Appointment Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(payment => (
                                        <tr key={payment._id}>
                                            <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                            <td>
                                                {payment.appointmentId &&
                                                    new Date(payment.appointmentId.date).toLocaleDateString()
                                                }
                                            </td>
                                            <td>${payment.amount.toFixed(2)}</td>
                                            <td className={`status-${payment.status}`}>
                                                {payment.status}
                                                {payment.status === 'cancelled'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No payment history found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSelection;