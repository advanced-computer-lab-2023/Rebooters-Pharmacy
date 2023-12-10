import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Pharmacist from "./pages/PharmacistHome";
import Admin from "./pages/Admin";
import Guest from "./pages/Guest";
import Patient from "./pages/Patient";
import PatientActivities from "./components/PatientAddAddress";
import CheckingOut from "./components/CheckingOut";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import AboutusPage from "./pages/AboutusPage";
import ContactPage from "./pages/ContactPage";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/pharmacist" element={<Pharmacist />} />   
          <Route path= "/admin" element={<Admin/>}/>
          <Route path= "/patient" element={<Patient/>}/>
          <Route path="/api/patient/addNewDeliveryAddress"  element={<PatientActivities/>}/>
          <Route path="/api/patient/checkOutmyOrder"  element={<CheckingOut/>}/>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTP />} />
          <Route path= "/AboutusPage" element={<AboutusPage/>}/>
          <Route path= "/ContactPage" element={<ContactPage/>}/>

         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;