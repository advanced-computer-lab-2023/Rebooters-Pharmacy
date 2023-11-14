import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Image from "../content/images/ELHANNY-LOGO.png";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark " style={{backgroundColor: "#44bab1"}}>
      <div className="container">
      <img src={Image} width="60"/>
        <Link to="/" className="navbar-brand"><span>el7a2ni</span></Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/guest" className="nav-link">Guest</Link>
            </li>
            <li className="nav-item">
              <Link to="/pharmacist" className="nav-link">Pharmacist</Link>
            </li>
            <li className="nav-item">
              <Link to="/patient" className="nav-link">Patient</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin" className="nav-link">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
