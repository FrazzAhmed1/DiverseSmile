import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

// Background image import
import homeback from "/src/assets/homeback.jpg";

import DiverseSmileLogo from "/src/assets/DiverseSmileLogo.png";
import Smile from "/src/assets/Smile.jpg";

const services = [
  {
    title: "General Dentistry",
    description: "Comprehensive care including exams, cleanings, and fillings.",
    icon: "🦷",
  },
  {
    title: "Cosmetic Dentistry",
    description: "Enhances appearance of smile with services like teeth whitening and veneers.",
    icon: "💎",
  },
  {
    title: "Implant Dentistry",
    description: "Permanent solutions for missing teeth with dental implants.",
    icon: "🦷",
  },
  {
    title: "Oral Surgery",
    description: "Extractions, jaw surgeries, and other surgical procedures.",
    icon: "🔪",
  },
  {
    title: "Endodontics",
    description: "Treats issues related to the inside of the tooth, including root canals.",
    icon: "🦴",
  },
  {
    title: "Sedation Dentistry",
    description: "Helps patients feel relaxed and comfortable during procedures through various sedation options.",
    icon: "😌",
  },
];

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">
          <img src={DiverseSmileLogo} alt="Logo" />
          DiverseSmile
        </div>
        <div className="nav-buttons">
          <Link to="/patient-login" className="nav-btn">Login</Link>
          <Link to="/patient-signup" className="nav-btn">Sign up</Link>
        </div>
      </nav>

      <div
        className="hero-section"
        style={{ backgroundImage: `url(${homeback})` }}
      >
        <div className="image-container">
          <img src={Smile} alt="Hero" className="hero-image" />
        </div>
        <div className="text-container">
          <h1>Your Smile,<br/>Our Priority</h1>
          <p>Choose us and get the best dental services in</p>
          <p>the city. Rates and charges vary.</p>
          <Link to="/patient-login" className="appointment-btn">
            Make an appointment
          </Link>
        </div>
      </div>

      <div className="services-section">
        <div className="services-container">
          <h2>Our Services and Specialties</h2>
          <div className="services-grid">
            {services.map((service, idx) => (
              <div key={idx} className="service-card">
                <span className="service-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          <p>Have questions? We have answers.</p>
          <Link to="/faq" className="faq-btn">Read FAQs</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
