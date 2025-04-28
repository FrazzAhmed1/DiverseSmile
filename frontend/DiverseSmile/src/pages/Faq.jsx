// pages/Faq.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Faq.css";

const faqs = [
  {
    question: "How often should I visit the dentist?",
    answer: "We recommend visiting at least once every 6 months for a routine checkup and cleaning.",
  },
  {
    question: "Do you accept insurance?",
    answer: "Yes, we accept most major insurance providers. Contact our front desk for details.",
  },
  {
    question: "What if I have a dental emergency?",
    answer: "Call us immediately at (916) 444-3333. We’ll prioritize your treatment.",
  },
  {
    question: "Are sedation options available for nervous patients?",
    answer: "Absolutely. We offer multiple sedation methods to help you feel comfortable.",
  },
  {
    question: "Can I reschedule my appointment?",
    answer: "Yes. Please contact us at least 24 hours in advance to reschedule.",
  },
];

const Faq = () => {
  return (
    <div className="faq-page">
      <header className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Your go-to guide for common dental care concerns.</p>
      </header>

      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-box">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <Link to="/" className="nav-btn">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Faq;
