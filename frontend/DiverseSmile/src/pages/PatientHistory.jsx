import React, { useState } from "react";
import "../styles/PatientHistory.css";


const PatientHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sample patient data
  const patients = [
    {
      id: 1,
      name: "John Doe",
      address: "123 Main St, Springfield",
      gender: "Male",
      age: 35,
      appointments: ["2023-01-15", "2023-02-20", "2023-03-10"],
    },
    {
      id: 2,
      name: "Jane Smith",
      address: "456 Elm St, Springfield",
      gender: "Female",
      age: 28,
      appointments: ["2023-01-10", "2023-02-25", "2023-03-15"],
    },
  ];

  // Filter patients based on the search term
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    // This function can be used to trigger search logic if needed
    console.log("Search triggered for:", searchTerm);
  };

  return (
    <div className="patient-history-container">
      <h1 className="page-title">Patient History</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a patient by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <div className="patient-list">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className={`patient-card ${
              selectedPatient?.id === patient.id ? "selected" : ""
            }`}
            onClick={() => setSelectedPatient(patient)}
          >
            <img src={patient.image} alt={patient.name} />
            <p>{patient.name}</p>
          </div>
        ))}
      </div>
      {selectedPatient && (
        <div className="patient-details">
          <h2>{selectedPatient.name}</h2>
          <p>
            <strong>Address:</strong> {selectedPatient.address}
          </p>
          <p>
            <strong>Gender:</strong> {selectedPatient.gender}
          </p>
          <p>
            <strong>Age:</strong> {selectedPatient.age}
          </p>
          <h3>Appointment History</h3>
          <ul>
            {selectedPatient.appointments.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;