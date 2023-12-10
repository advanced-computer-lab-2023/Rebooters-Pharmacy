import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from "../content/images/ELHANNY-LOGO.png";
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <div className="navbar-container py-2">
      <div className="container">
        <div className="d-flex align-items-center">
          <div className="nav-logo">
            <div className="d-flex align-items-center">
              <img src={Image} width="60" alt="El7a2ni Logo" />
              <Link to="/" className="logo-name"><span>El7a2ni</span></Link>
            </div>
          </div>
          <div className="nav-items" role="navigation">
            <ul className="nav-list">
              <li><Link to="" className=""><span>Home</span></Link></li>
              <li><Link to="" className=""><span>About</span></Link></li>
              <li><Link to="" className=""><span>Contact</span></Link></li>
              <li><Link to="" className=""><span>Help</span></Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
