import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import loginCoverImage from "../content/images/login-cover.png";
import Navbar from "../components/Navbar";
import "../styles/au.css";
import Footer from "../components/footer";
const Conc = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Set a delay to trigger the animation after a short period (e.g., 500 milliseconds)
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Clear the timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="site-wrap">
      <Navbar />
      <div
        className="xy-cover"
        style={{
          backgroundImage: `url(${loginCoverImage})`,
          backgroundSize: "cover",
          height: "89.8vh",
          position: "relative",
        }}
      >
        <div
          className="text-center"
          style={{
            marginLeft: "30px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "black",backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            padding: '20px', 
            borderRadius: '10px', 
          }}
        >
          <>
            {showContent && (
              <>
                <h1 className="fade-in" style={{ fontSize: "52px" }}>
                  Contact Info
                </h1>
                <ul className="list-unstyled">
                  <li className="fade-in" style={{ fontSize: "style= 28px" }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {''} <a
                      href="https://www.google.com/maps?q=GUC,El+Tagamoa+El+Khames,New+Cairo+City,Egypt"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GUC - El Tagamoa El Khames New Cairo City - Egypt
                    </a>
                  </li>
                  <li className={`fade-in ${showContent ? 'visible' : ''}`} style={{ fontSize: 'style= 28px' }}>
                    <FontAwesomeIcon icon={faPhone} /> <a href="tel://23923929210">+1 23456789</a>
                  </li>
                  <li className={`fade-in ${showContent ? 'visible' : ''}`} style={{ fontSize: 'style= 28px' }}>
                   <FontAwesomeIcon icon={faEnvelope} /> <a href="mailto:rebootersteam9@gmail.com">rebootersteam9@gmail.com</a>
                  </li>
                </ul>
              </>
            )}
          </>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Conc;
