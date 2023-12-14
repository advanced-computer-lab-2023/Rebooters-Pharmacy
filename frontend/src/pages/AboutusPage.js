import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faUndo,
  faHeadset,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import loginCoverImage from "../content/images/login-cover.png";
import bgImage from "../content/images/bg_1.jpg";
import heroImage from "../content/images/hero_1.jpg";
import "../styles/au.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
const AboutUs = () => {
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showMissionCard, setShowMissionCard] = useState(false);
  const [showTrustedCompanyCard, setShowTrustedCompanyCard] = useState(false);

  const aboutUsRef = useRef(null);
  const missionCardRef = useRef(null);
  const trustedCompanyCardRef = useRef(null);

  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        switch (entry.target) {
          case aboutUsRef.current:
            setShowAboutUs(true);
            break;
          case missionCardRef.current:
            setShowMissionCard(true);
            break;
          case trustedCompanyCardRef.current:
            setShowTrustedCompanyCard(true);
            break;
          default:
            break;
        }
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (aboutUsRef.current) {
      observer.observe(aboutUsRef.current);
    }
    if (missionCardRef.current) {
      observer.observe(missionCardRef.current);
    }
    if (trustedCompanyCardRef.current) {
      observer.observe(trustedCompanyCardRef.current);
    }

    return () => {
      if (aboutUsRef.current) {
        observer.unobserve(aboutUsRef.current);
      }
      if (missionCardRef.current) {
        observer.unobserve(missionCardRef.current);
      }
      if (trustedCompanyCardRef.current) {
        observer.unobserve(trustedCompanyCardRef.current);
      }
    };
  }, []);

  return (
    <div className="site-wrap">
      <Navbar />
      <div
        className="xy-cover"
        style={{
          backgroundImage: `url(${loginCoverImage})`,
          backgroundSize: "cover",
          height: "100vh",
          position: "relative",
        }}
      >
        <div
          className="text-center"
          style={{
            marginLeft: "40px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "black",
          }}
        >
          <h1 style={{ fontSize: "52px" }}>About Us</h1>
          <p
            ref={aboutUsRef}
            className={`fade-in ${showAboutUs ? "visible" : ""}`}
            style={{ fontSize: "28px" }}
          >
            Welcome to El7a2ni Pharmacy, your trusted partner in health and
            wellness. At El7a2ni, we are committed to providing high-quality
            pharmaceutical products and services to our valued patients.
          </p>
        </div>
      </div>

      <div className="container-fluid mt-5">
        {/* Mission Card */}
        <div
          className={`row justify-content-center mb-5 ${
            showMissionCard ? "fade-in slide-from-left" : ""
          }`}
          ref={missionCardRef}
        >
          <div className="col-md-8">
            <div
              className="site-section bg-light custom-border-bottom"
              data-aos="fade"
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="block-16">
                    <figure>
                      <img
                        src={bgImage}
                        alt="Image placeholder"
                        className="img-fluid rounded"
                      />
                    </figure>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <div className="site-section-heading pt-3">
                      <h2 className="text-black">Mission</h2>
                    </div>
                    <p>
                      Our mission is to enhance the well-being of our community
                      by ensuring access to a wide range of healthcare
                      solutions. Whether you're looking for prescription
                      medications, over-the-counter products, or personalized
                      health advice, our dedicated team of pharmacists and staff
                      is here to assist you.
                    </p>
                    <p>
                      El7a2ni Pharmacy is more than just a place to fill your
                      prescriptions; we strive to create a welcoming and caring
                      environment. Your health is our priority, and we work
                      tirelessly to exceed your expectations in every aspect of
                      our service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Company Card */}
        <div
          className={`row justify-content-center mb-5 ${
            showTrustedCompanyCard ? "fade-in slide-from-right" : ""
          }`}
          ref={trustedCompanyCardRef}
        >
          <div className="col-md-8">
            <div
              className="site-section bg-light custom-border-bottom"
              data-aos="fade"
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="block-16">
                    <figure>
                      <img
                        src={heroImage}
                        alt="Image placeholder"
                        className="img-fluid rounded"
                      />
                    </figure>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <div className="site-section-heading pt-3 mb-4">
                      <h2 className="text-black">We Are A Trusted Company</h2>
                    </div>
                    <p className="text-black">
                      We value the trust you place in us, and we are honored to
                      be part of your healthcare journey. Thank you for choosing
                      El7a2ni Pharmacy as your healthcare partner. We look
                      forward to serving you with dedication and compassion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Shipping, Free Returns, Customer Support */}
        <div
          className="row justify-content-center mb-5 slide-in"
          style={{ marginLeft: "10px" }}
        >
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2>
                <FontAwesomeIcon icon={faTruck} /> Free Shipping
              </h2>
              <p>
                Experience the convenience of free shipping on all your pharmacy
                orders.
              </p>
            </div>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2>
                <FontAwesomeIcon icon={faUndo} /> Free Returns
              </h2>
              <p>
                We stand by the quality of our pharmaceutical products. Enjoy
                hassle-free returns if you are not satisfied with your purchase.
              </p>
            </div>
          </div>
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="text">
              <h2>
                <FontAwesomeIcon icon={faHeadset} /> Customer Support
              </h2>
              <p>Our dedicated customer support team is here to assist you.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
