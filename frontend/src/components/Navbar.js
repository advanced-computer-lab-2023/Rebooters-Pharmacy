import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "../content/images/ELHANNY-LOGO.png";
import "../styles/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  const isActive = (path) => {
    return path === activeLink ? { color: "#1aac83" } : {};
  };

  return (
    <div className="navbar-container py-2 border-bottom">
      <div className="container">
        <div className="d-flex align-items-center">
          <div className="nav-logo">
            <div className="d-flex align-items-center">
              <img src={Image} width="60" alt="El7a2ni Logo" />
              <Link to="/homePage" className="logo-name">
                <span>El7a2ni</span>
              </Link>
            </div>
          </div>
          <div className="nav-items" role="navigation">
            <ul className="nav-list">
              <li>
                <Link
                  to="/homePage"
                  className="nav-item"
                  onClick={() => handleLinkClick("/homePage")}
                  style={isActive("/homePage")}
                >
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/AboutusPage"
                  className="nav-item"
                  onClick={() => handleLinkClick("/AboutusPage")}
                  style={isActive("/AboutusPage")}
                >
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/ContactPage"
                  className="nav-item"
                  onClick={() => handleLinkClick("/ContactPage")}
                  style={isActive("/ContactPage")}
                >
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/helpYou"
                  className="nav-item"
                  onClick={() => handleLinkClick("")}
                  style={isActive("")}
                >
                  <span>Help</span>
                </Link>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
