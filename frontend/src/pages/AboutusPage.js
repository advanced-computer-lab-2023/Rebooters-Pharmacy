import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faUndo, faHeadset,faMapMarkerAlt,faPhone,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import loginCoverImage from '../content/images/login-cover.png';
import bgImage from '../content/images/bg_1.jpg';
import heroImage from '../content/images/hero_1.jpg';
import "../styles/au.css";
import kkIm from '../content/images/background-pharmacy.jpg'
import Navbar from '../components/Navbar';


const AboutUs = () => {
  return (
    <div className="site-wrap">
        <Navbar/>

      {/* Container with background image */}
      <div className='xy-cover' style={{  backgroundImage: `url(${loginCoverImage})`, backgroundSize: 'cover', height: '100vh', position: 'relative' }}>
        {/* Text about us */}
        <div className="text-center" style={{marginLeft: '40px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black' }}>
          <h1>About Us</h1>
          <p>
            Welcome to El7a2ni Pharmacy, your trusted partner in health and wellness. At El7a2ni, we are committed to providing high-quality pharmaceutical products and services to our valued patients.
          </p>
        </div>
      </div>

      <div className="container-fluid mt-5" style={{ marginLeft: '50px' }}> {/* Adjust the margin-left as needed */}
        {/* Mission Card */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="site-section bg-light custom-border-bottom" data-aos="fade">
              <div className="row mb-5">
                <div className="col-md-6">
                  <div className="block-16">
                    <figure>
                      <img src={bgImage} alt="Image placeholder" className="img-fluid rounded" />
                    </figure>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <div className="site-section-heading pt-3 mb-4">
                      <h2 className="text-black">Mission</h2>
                    </div>
                    <p>
                      Our mission is to enhance the well-being of our community by ensuring access to a wide range of healthcare solutions. Whether you're looking for prescription medications, over-the-counter products, or personalized health advice, our dedicated team of pharmacists and staff is here to assist you.
                    </p>
                    <p>
                      El7a2ni Pharmacy is more than just a place to fill your prescriptions; we strive to create a welcoming and caring environment. Your health is our priority, and we work tirelessly to exceed your expectations in every aspect of our service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Company Card */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="site-section bg-light custom-border-bottom" data-aos="fade">
              <div className="row mb-5">
                <div className="col-md-6">
                  <div className="block-16">
                    <figure>
                      <img src={heroImage} alt="Image placeholder" className="img-fluid rounded" />
                    </figure>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <div className="site-section-heading pt-3 mb-4">
                      <h2 className="text-black">We Are A Trusted Company</h2>
                    </div>
                    <p className="text-black">
                      We value the trust you place in us, and we are honored to be part of your healthcare journey. Thank you for choosing El7a2ni Pharmacy as your healthcare partner. We look forward to serving you with dedication and compassion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Shipping, Free Returns, Customer Support */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2><FontAwesomeIcon icon={faTruck} /> Free Shipping</h2>
              <p>Experience the convenience of free shipping on all your pharmacy orders.</p>
            </div>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2><FontAwesomeIcon icon={faUndo} /> Free Returns</h2>
              <p>We stand by the quality of our pharmaceutical products. Enjoy hassle-free returns if you are not satisfied with your purchase.</p>
            </div>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2><FontAwesomeIcon icon={faHeadset} /> Customer Support</h2>
              <p>Our dedicated customer support team is here to assist you.</p>
            </div>
          </div>
        </div>

        <footer className="site-footer">
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <div className="block-5 mb-5">
              <div className="container-fluid mt-5" style={{ marginLeft: '1070px' }}> {/* Adjust the margin-left as needed */}

                <h3 className="footer-heading mb-4">Contact Info</h3>
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
          </div>
        </footer>
      </div>
      </div>

  );
};

export default AboutUs;
