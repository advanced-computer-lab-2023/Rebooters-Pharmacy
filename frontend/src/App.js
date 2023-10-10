import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Home from "./pages/Home";
//import Navbar from "./components/Navbar";
//import DoctorHome from "./pages/DoctorHome";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacist-home" element={<PharmacistHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
