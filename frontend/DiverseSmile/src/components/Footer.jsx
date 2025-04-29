// Footer.jsx: footer rendering section of the website, including hours, etc.

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>New Patients: (916) 887-5455</p>
          <p>Existing Patients: (916) 444-2222</p>
          <p>6000 J Street, Sacramento, CA 95819</p>
        </div>

        <div className="footer-section">
          <h3>Office Hours</h3>
          <p>Monday - Friday: 9:00 AM-5:00 PM</p>
        </div>

        {/* Quick Links: Provides navigation links for patients, staff, and FAQs. */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
          <Link to="/">Home</Link>
            <Link to="/patient-login">Patient Account</Link>
            <Link to="/staff-login">Staff Account</Link>
            <Link to="/admin-login">Admin Account</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </div>

      
      <p className="copyright">© 2025 DiverseSmile. All rights reserved</p>
    </footer>
  );
};

export default Footer;