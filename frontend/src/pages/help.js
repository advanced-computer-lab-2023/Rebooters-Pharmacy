import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import loginCoverImage from '../content/images/login-cover.png';
import '../styles/au.css'; // Add your CSS file if not already included

const Help = () => {
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
    <div style={{ textAlign: 'center' }}>
      <Navbar />
      <div
        className='xy-cover fade-in'
        style={{
          backgroundImage: `url(${loginCoverImage})`,
          backgroundSize: 'cover',
          height: '145vh',
        }}
      >
         <div
          style={{
            margin: '20px auto',
            maxWidth: '800px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the opacity here
            padding: '20px', // Add padding for better readability
            borderRadius: '10px', // Add border-radius for rounded corners
          }}
        >
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Help Center</h2>

           {/* Frequently Asked Questions */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>Frequently Asked Questions (FAQs)</h3>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
              <li style={{ marginBottom: '15px' }}>
               
      <strong>Q:</strong> How can I create an account on your platform?
      <br />
      <strong>A:</strong> To create an account, click on the "Register" button found in the homepage. Fill in the required information and follow the prompts to complete the registration process.
    </li>
    <li>
      <strong>Q:</strong> Can I track the status of my order?
      <br />
      <strong>A:</strong> Yes, you can track your order in the "Order" section of your account. Once your order is shipped, you'll be able to view all the details on your order.
    </li>
    <li>
      <strong>Q:</strong> What payment methods do you accept?
      <br />
      <strong>A:</strong> We accept various payment methods, including credit/debit cards, wallet and cash on delivery. During the checkout process, you can choose your preferred payment option.
    </li>
    <li>
      <strong>Q:</strong> How can I reset my password?
      <br />
      <strong>A:</strong> If you forget your password, click on the "Forgot Password" link on the login page. Enter your email address, and we'll send you a link to reset your password.
    </li>
    <li>
      <strong>Q:</strong> Are your products genuine and safe?
      <br />
      <strong>A:</strong> Yes, we source our pharmaceutical products from reputable suppliers. All medications undergo strict quality control to ensure they meet safety and efficacy standards.
    </li>
  </ul>
</div>


          {/* Usage Guidelines */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>Usage Guidelines</h3>
            <p style={{ fontSize: '18px' }}>
             
              Welcome to our online pharmacy platform. Here are some guidelines to ensure a smooth experience:
            </p>
            <ul>
              <li>Ensure your account information is up-to-date.</li>
              <li>Browse through our product categories to find the medications you need.</li>
              <li>Read product descriptions and dosage information carefully.</li>
              {/* Add more guidelines as needed */}
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>Contact Support</h3>
            <p style={{ fontSize: '18px' }}>
             
              If you need assistance or have any questions, feel free to contact our customer support team...
            </p>

            {/* Contact Information */}
            <div >
            <ul style={{ listStyleType: 'none', padding: '0', fontSize: '18px' }}>
                  <li className={`fade-in ${showContent ? 'visible' : ''}`} style={{ fontSize: 'style= 28px' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> GUC - El Tagamoa El Khames New Cairo City - Egypt
                  </li>
                  <li className={`fade-in ${showContent ? 'visible' : ''}`} style={{ fontSize: 'style= 28px' }}>
                    <FontAwesomeIcon icon={faPhone} /> <a href="tel://23923929210">+1 23456789</a>
                  </li>
                  <li className={`fade-in ${showContent ? 'visible' : ''}`} style={{ fontSize: 'style= 28px' }}>
                    <FontAwesomeIcon icon={faEnvelope} /> rebootersteam9@gmail.com
                    </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};


export default Help;
