import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from "../content/images/ELHANNY-LOGO.png";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark " style={{backgroundColor: "#44bab1"}}>
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
            <Link to="/AboutusPage" className="nav-link">About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/ContactPage" className="nav-link">Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link to="" className="nav-link">Help</Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/admin" className="nav-link">Admin</Link>
            </li> */}
          </ul>
        </div>
    </nav>
  );
};

export default Navbar;
