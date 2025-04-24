import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientSignup from "./pages/PatientSignup";
import StaffSignup from "./pages/StaffSignup";
import AdminSignup from "./pages/AdminSignup";
import PatientLogin from "./pages/PatientLogin";
import StaffLogin from "./pages/StaffLogin";
import AdminLogin from "./pages/AdminLogin";
import PatientDashboard from "./pages/PatientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import CreateNewPassword from "./pages/CreateNewPassword";
import AppointmentScheduler from "./pages/AppointmentScheduler";
import Reminder from "./pages/Reminder";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import LoginHours from "./pages/LoginHours"; //testing
import "./styles/Footer.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patient-signup" element={<PatientSignup />} />
            <Route path="/staff-signup" element={<StaffSignup />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/create-new-password" element={<CreateNewPassword />} />
            <Route path="/schedule" element={<AppointmentScheduler />} />
            <Route path="/schedule-reminder" element={<Reminder />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/login-hours" element={<LoginHours />} /> 
            <Route path="questions" element={<Faq />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
