import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Pharmacist from "./pages/PharmacistHome";
import Admin from "./pages/Admin";
import Guest from "./pages/Guest";
import Patient from "./pages/Patient";
import PatientActivities from "./components/PatientAddAddress";
import CheckingOut from "./components/CheckingOut";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/pharmacist" element={<Pharmacist />} />   
          <Route path= "/admin" element={<Admin/>}/>
          <Route path= "/patient" element={<Patient/>}/>
          <Route path="/api/patient/addNewDeliveryAddress"  element={<PatientActivities/>}/>
          <Route path="/api/patient/checkOutmyOrder"  element={<CheckingOut/>}/>

         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;