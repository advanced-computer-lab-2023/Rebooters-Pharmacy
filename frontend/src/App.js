import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Medicine from "./components/Medicine";
import PharmacistHome from "./pages/PharmacistHome";
import PharmReq from "./pages/PharmReq";
import AddPatient from "./pages/Patient";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacist-home" element={<PharmacistHome />} />   
          <Route path="/medicine" element={<Medicine modelName="administrator"/>} />
          <Route path= "/PharmReq" element={<PharmReq/>}/>
          
          <Route path= "/AddPatient" element={<AddPatient/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;