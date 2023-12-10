import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faUndo, faHeadset,faMapMarkerAlt,faPhone,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import loginCoverImage from '../content/images/login-cover.png';
import Navbar from '../components/Navbar';

const Conc = () => {
    return (
      <div className="site-wrap">
          <Navbar/>
          <div className='xy-cover' style={{  backgroundImage: `url(${loginCoverImage})`, backgroundSize: 'cover', height: '100vh', position: 'relative' }}>
          <div className="text-center" style={{marginLeft: '30px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black' }}>
       
          <h1>Contact Info</h1>
                <ul className="list-unstyled">
                  <li className="address">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> GUC - El Tagamoa El Khames New Cairo City - Egypt
                  </li>
                  <li className="phone">
                    <FontAwesomeIcon icon={faPhone} /> <a href="tel://23923929210">+1 23456789</a>
                  </li>
                  <li className="email">
                    <FontAwesomeIcon icon={faEnvelope} /> rebootersteam9@gmail.com
                  </li>
                </ul>
                </div>
                </div>
                </div>
    );
};
export default Conc;

