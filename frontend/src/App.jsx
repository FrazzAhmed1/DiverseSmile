import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientSignup from "./pages/PatientSignup";
import StaffSignup from "./pages/StaffSignup";
import PatientLogin from "./pages/PatientLogin";
import StaffLogin from "./pages/StaffLogin";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/staff-signup" element={<StaffSignup />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;