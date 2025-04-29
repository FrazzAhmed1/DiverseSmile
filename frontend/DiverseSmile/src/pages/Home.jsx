// src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSelector from "../components/LanguageSelector";
import "../styles/Home.css";

import DiverseSmileLogo from "/src/assets/DiverseSmileLogo.png";
import HomeBack from "/src/assets/homeback.mp4";

const services = [
  { key: "generalDentistry", descKey: "generalDentistryDesc", icon: "🦷" },
  { key: "cosmeticDentistry", descKey: "cosmeticDentistryDesc", icon: "💎" },
  { key: "implantDentistry", descKey: "implantDentistryDesc", icon: "🦷" },
  { key: "oralSurgery", descKey: "oralSurgeryDesc", icon: "🔪" },
  { key: "endodontics", descKey: "endodonticsDesc", icon: "🦴" },
  { key: "sedationDentistry", descKey: "sedationDentistryDesc", icon: "😌" },
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <img src={DiverseSmileLogo} alt={t("logoAlt", "Logo")} />
            {t("brandName", "DiverseSmile")}
          </div>
          <LanguageSelector />
        </div>

        <div className="nav-right">
          <Link to="/patient-login" className="nav-btn">
            {t("login")}
          </Link>
          <Link to="/patient-signup" className="nav-btn">
            {t("signup")}
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <video
          className="hero-bg-video"
          src={HomeBack}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-content">
          <h1>{t("yourSmile")}</h1>
          <p>{t("chooseUs")}</p>
          <Link to="/patient-login" className="appointment-btn">
            {t("makeAppointment")}
          </Link>
        </div>
      </section>

      <div className="services-section">
        <div className="services-container">
          <h2>{t("Our Services")}</h2>
          <div className="services-grid">
            {services.map(({ key, descKey, icon }) => (
              <div key={key} className="service-card">
                <span className="service-icon">{icon}</span>
                <h3>{t(key)}</h3>
                <p>{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-container">
          <h2>{t("frequentlyAskedQuestions")}</h2>
          <p>{t("haveQuestions")}</p>
          <Link to="/faq" className="faq-btn">
            {t("readFAQs")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
