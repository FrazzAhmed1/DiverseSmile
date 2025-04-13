// Greeting.jsx
import React from "react";

const Greeting = () => {
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  };

  return <h1>{getGreeting()}</h1>;
};

export default Greeting;
