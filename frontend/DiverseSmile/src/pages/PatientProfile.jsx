import React, { useState } from "react";
import "../styles/PatientHistory.css";

const PatientProfile = () => {
  // State for user input fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  const handleSave = () => {
    // Logic to handle form submission
    console.log("User Information:", { name, address, gender, age });
    alert("Information saved successfully!");
  };

  return (
    <div className="patient-profile-container">
      <h1 className="page-title">Patient Profile</h1>
      <div className="patient-details">
        <div>
          <label>
            <strong>Name:</strong>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Address:</strong>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Gender:</strong>
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Enter your gender"
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Age:</strong>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </label>
        </div>
        <button onClick={handleSave} className="save-button">
          Save
        </button>
      </div>
    </div>
  );
};

export default PatientProfile;