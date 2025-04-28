import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import "../styles/PaymentProcess.css";
import axios from 'axios';

const API_BASE = "http://localhost:5000";

const PaymentProcess = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [appointmentId, setAppointmentId] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Get appointmentId from URL query params
        const params = new URLSearchParams(location.search);
        const id = params.get('appointmentId');
        if (id) {
            setAppointmentId(id);
            setAmount(75.00); // Set fixed appointment fee
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!name) {
            setError('Enter cardholder name');
            return;
        }
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            setError('Enter 16-digit card number please');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            setError('Enter valid MM/YY expiry');
            return;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            setError('Enter a 3-4 digit CVV');
            return;
        }

        try {
            setProcessing(true);
            setError(null);

            // Process payment
            await axios.post(
                `${API_BASE}/api/payments/process`,
                { appointmentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Redirect to confirmation
            navigate('/payment-confirmation', {
                state: {
                    amount: amount,
                    appointmentId: appointmentId
                }
            });
        } catch (err) {
            console.error('Payment failed:', err);
            setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const formatCard = (value) => value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');

    return (
        <div className="dashboard-page">
            <Sidebar />
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Payment Details</h1>
                    <p>Enter your card information securely</p>
                </header>
                <div className="payment-process-container">
                    {error && <div className="payment-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="form-group">
                            <label>Cardholder Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full name on card"
                            />
                        </div>

                        <div className="form-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                value={formatCard(cardNumber)}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    value={expiry}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                        setExpiry(val);
                                    }}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                    placeholder="123"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <div className="amount-summary">
                            <span>Total Amount:</span>
                            <span>${amount.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Confirm Payment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentProcess;