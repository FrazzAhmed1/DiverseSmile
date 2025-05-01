import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PatientHistory.css";

const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMedicalHistory, setShowMedicalHistory] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authorization token not found. Please log in.");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format: expected an array of patients.");
        }

        setPatients(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [navigate]);

  useEffect(() => {
    const suggestions = patients
      .filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) && searchTerm.length > 0;
      })
      .slice(0, 5);
    setFilteredSuggestions(suggestions);
  }, [searchTerm, patients]);

  // Close suggestions if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-bar")) {
        setFilteredSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(`${patient.firstName} ${patient.lastName}`);
    setFilteredSuggestions([]);
    setShowMedicalHistory(true);
  
    // Blur search input manually
    const input = document.querySelector(".search-bar input");
    if (input) input.blur();
  };
  

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) return <div className="loading">Loading patients...</div>;

  return (
    <div className="patient-history-container">
      <h1 className="page-title">Patient History</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a patient by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredSuggestions.length > 0 && (
          <div className="autocomplete-suggestions">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.firstName} {suggestion.lastName}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="patient-list">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className={`patient-card ${selectedPatient?._id === patient._id ? "selected" : ""}`}
            onClick={() => handleSelectSuggestion(patient)}
          >
            <div className="patient-avatar">
              {`${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`}
            </div>
            <p>{patient.firstName} {patient.lastName}</p>
          </div>
        ))}
      </div>

      {selectedPatient && (
        <div className="patient-details">
          <h2>{selectedPatient.firstName} {selectedPatient.lastName}</h2>

          <div className="detail-grid">
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedPatient.address || 'N/A'}</p>
            <p><strong>Age:</strong> {selectedPatient.age || 'N/A'}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone || 'N/A'}</p>
          </div>

          <div style={{ marginTop: "10px" }}>
            <button
              className="toggle-history-button"
              onClick={() => setShowMedicalHistory(!showMedicalHistory)}
            >
              {showMedicalHistory ? 'Hide' : 'Show'} Medical History
              <span>{showMedicalHistory ? '▲' : '▼'}</span>
            </button>
          </div>

          <div className={`medical-history-section ${showMedicalHistory ? '' : 'medical-history-hidden'}`}>
            {selectedPatient.medicalHistory || 'No medical history provided'}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
