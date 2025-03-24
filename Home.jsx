import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to DiverseSmile</h1>
      <div className="home-buttons">
        <Link to="/patient-signup" className="home-button">
          Patient Signup
        </Link>
        <Link to="/staff-signup" className="home-button">
          Staff Signup
        </Link>
      </div>
    </div>
  );
};

export default Home;