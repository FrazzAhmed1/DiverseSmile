import React, { useState } from "react";
import "../styles/Reminder.css";
import DiverseSmileLogo from "/src/assets/DiverseSmileLogo.png";


const Reminder = () => {
 const [contactInfo, setContactInfo] = useState("");
 const [message, setMessage] = useState("");


 const handleSubmit = (e) => {
   e.preventDefault();
   if (contactInfo) {
     setMessage(`Reminder set successfully for ${contactInfo}`);
     setContactInfo(""); // Clear the input field
   } else {
     setMessage("Please enter a valid email or phone number.");
   }
 };


 return (
   <div>
     {/* Navbar */}
     <nav className="navbar">
       <div className="logo">
         <img src={DiverseSmileLogo} alt="DiverseSmile" />
         DiverseSmile
       </div>
       <div className="nav-buttons">
       </div>
     </nav>


     {/* Reminder Content */}
     <div className="reminder-container">
       <h1>Appointment Reminder</h1>
       <p>Enter your email or phone number to receive appointment reminders via text messages.</p>
       <form onSubmit={handleSubmit} className="reminder-form">
         <input
           type="text"
           placeholder="Enter email or phone number"
           value={contactInfo}
           onChange={(e) => setContactInfo(e.target.value)}
           className="reminder-input"
         />
         <button type="submit" className="reminder-btn">Set Reminder</button>
       </form>
       {message && <p className="reminder-message">{message}</p>}
     </div>
   </div>
 );
};


export default Reminder;
