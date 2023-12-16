import { BrowserRouter, Routes, Route } from "react-router-dom";
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";

import Home from "./pages/Home";
import Pharmacist from "./pages/PharmacistHome";
import Admin from "./pages/Admin";
import Patient from "./pages/Patient";
import PatientActivities from "./components/PatientAddAddress";
import CheckingOut from "./components/CheckingOut";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import AboutusPage from "./pages/AboutusPage";
import ContactPage from "./pages/ContactPage";
import Homey from "./pages/homePage";
import Medicine from "./components/Medicine";
import AddPatient from "./pages/regPat";
import PharmReq from "./pages/regPharm";
import Help from "./pages/help";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homey />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pharmacist" element={<Pharmacist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/patient" element={<Patient />} />
          <Route
            path="/api/patient/addNewDeliveryAddress"
            element={<PatientActivities />}
          />
          <Route
            path="/api/patient/checkOutmyOrder"
            element={<CheckingOut />}
          />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/AboutusPage" element={<AboutusPage />} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/homePage" element={<Homey />} />
          <Route path="/medicines" element={<Medicine />} />
          <Route path="/regPat" element={<AddPatient />} />
          <Route path="/regPharm" element={<PharmReq />} />
          <Route path="/helpYou" element={<Help />} />



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
