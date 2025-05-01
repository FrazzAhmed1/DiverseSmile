import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PatientHistory.css";

const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(""); 

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authorization token not found. Please log in.");
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/patients', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonErr) {
          throw new Error("Failed to parse response JSON.");
        }

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

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }
//patient search
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
      </div>

      <div className="patient-list">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className={`patient-card ${selectedPatient?._id === patient._id ? "selected" : ""}`}
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="patient-avatar">
              {`${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`}
            </div>
            <p>{patient.firstName} {patient.lastName}</p>
          </div>
        ))}
      </div>
//patient history and info
      {selectedPatient && (
        <div className="patient-details">
          <h2>{selectedPatient.firstName} {selectedPatient.lastName}</h2>
          <p><strong>Email:</strong> {selectedPatient.email}</p>
          <p><strong>Address:</strong> {selectedPatient.address || 'N/A'}</p>
          <p><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</p>
          <p><strong>Age:</strong> {selectedPatient.age || 'N/A'}</p>
          <p><strong>Phone:</strong> {selectedPatient.phone || 'N/A'}</p>

          <h3>Medical History</h3>
          <p>{selectedPatient.medicalHistory || 'No medical history provided'}</p>

          <h3>Appointment History</h3>
          {selectedPatient.appointments?.length > 0 ? (
            <ul>
              {selectedPatient.appointments.map((appointment, index) => (
                <li key={index}>
                  {new Date(appointment.date).toLocaleDateString()} - {appointment.service}
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointment history</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
