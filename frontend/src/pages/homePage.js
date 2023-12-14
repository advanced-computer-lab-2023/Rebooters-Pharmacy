import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import loginCoverImage from '../content/images/bga.png';
import '../styles/home.css';

const Homey = () => {
  const [containerTransform, setContainerTransform] = useState('translateX(-100%)');

  useEffect(() => {
    // Update the transform when the component mounts
    setContainerTransform('translateX(0)');
  }, []);

  return (
    <div className="site-wrap" style={{ backgroundImage: `url(${loginCoverImage})`, backgroundSize: 'cover', height: '100vh', position: 'relative' }}>
      <Navbar />

      <div className="home-page" style={{ backgroundImage: `url(${loginCoverImage})`, backgroundSize: 'cover', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '20px', overflow: 'hidden' }}>
        <div className="button-container" style={{ height: '45vh', textAlign: 'left', color: '#fff', fontFamily: 'Arial, sans-serif', transform: containerTransform, transition: 'transform 0.5s ease-in-out' }}>
          <h1 style={{ fontSize: '40px', marginBottom: '20px' }}>Welcome to El7a2ni Pharmacy</h1>
          <div className="button-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Link to="/" className="btn1 btn1-primary" style={{ margin: '10px 0' }}>Login</Link>
            <Link to="/regPharm" className="btn1 btn1-primary" style={{ margin: '10px 0' }}>Register as Pharmacist</Link>
            <Link to="/regPat" className="btn1 btn1-primary" style={{ margin: '10px 0' }}>Register as Patient</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homey;
