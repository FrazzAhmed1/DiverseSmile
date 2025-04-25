import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import "../styles/PaymentProcess.css";
 
const PaymentProcess = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation for card details to ensure they are correct
       if (!name) return alert('Enter cardholder name');
        if (cardNumber.replace(/\s/g, '').length !== 16) return alert('Enter 16-digit card number please');
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return alert('Enter valid MM/YY expiry');
        if (!/^\d{3,4}$/.test(cvv)) return alert('Enter a 3-4 digit CVV');

        window.location.href = "/payment-confirmation";
    };

    const formatCard = (value) => value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
     
    return ( 
        // This is the payment process page with a form for entering card details
        <div className="dashboard-page">  
            <Sidebar />
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Payment Details</h1>
                    <p>Enter your card information securely</p>
                </header>
                <div className="payment-process-container">
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
                            <span>$370.00</span>
                        </div>

                        <button type="submit" className="submit-button">
                            Confirm Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentProcess;