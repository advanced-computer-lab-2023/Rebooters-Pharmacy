import { BrowserRouter, Routes, Route } from "react-router-dom";
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";

import Home from "./pages/Home";
import Pharmacist from "./pages/PharmacistHome";
import Admin from "./pages/Admin";
import Guest from "./pages/Guest";
import Patient from "./pages/Patient";
import PatientActivities from "./components/PatientAddAddress";
import CheckingOut from "./components/CheckingOut";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import Medicine from "./components/Medicine";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/guest" element={<Guest />} />
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
          <Route path="/medicines" element={<Medicine />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
