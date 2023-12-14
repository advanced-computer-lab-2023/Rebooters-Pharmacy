import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Medicine from "../components/Medicine";
import PatientActivities from "../components/PatientActivities";
import ViewCartItems from "../components/ViewCartItems";
import ViewAndCancelOrder from "../components/viewAndCancelOrder";
import CheckingOut from "../components/CheckingOut";
import ChangePassword from "../components/ChangePassword";
import PatientChats from "../components/PatientChats";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Image from "../content/images/ELHANNY-LOGO.png";
import { Link } from "react-router-dom";
import PatientProfile from "../components/patientProfile";
import Footer from "../components/footer";
import "../styles/cartItems.css";

const Patient = () => {
  const [sharedState, setSharedState] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]); // Add this line
  const [activeTab, setActiveTab] = useState("home");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the fragment identifier is set to "medicines"
    if (location.hash === "#medicines") {
      // Set the active tab to "medicines"
      setActiveTab("medicines");
    }
  }, [location]);

  useEffect(() => {
    // Check the URL hash to determine the active tab or section
    const hash = window.location.hash;
    if (hash === "#medicines") {
      setActiveTab("medicines");
    }
  }, []);

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/patient");
        if (response.status === 401 || response.status === 403) {
          // Close the active chat before navigating away
          if (activeChat) {
            await closeActiveChat(activeChat);
          }
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();

    return () => {
      // Clean up: Close the active chat if the component is unmounted
      if (activeChat) {
        closeActiveChat(activeChat);
      }
    };
  }, [navigate, activeChat]);

  const handleLogout = async () => {
    try {
      // Close the active chat before logging out
      if (activeChat) {
        await closeActiveChat(activeChat);
      }

      const response = await fetch("/api/patient/logout", {
        method: "GET",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const closeActiveChat = async (chatId) => {
    try {
      await axios.delete(`/api/patient/deleteChat/${chatId}`);
      console.log("Chat closed:", chatId);
      setActiveChat(null);
      // Refresh the chat list by filtering out the closed chat
      setChats(chats.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.error("Error closing chat:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const togglePasswordPopup = () => {
    setShowPasswordPopup(!showPasswordPopup);
  };
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg border-bottom"
        style={{ backgroundColor: "#white" }}
      >
        <img src={Image} width="60" />
        <Link to="" className="logo-name">
          <span>El7a2ni</span>
        </Link>
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
          <ul className="nav-list">
            <li
              className={`nav-item nav-btn ${
                activeTab === "home" ? "active" : ""
              }`}
            >
              <button
                className="nav-link nav-btn"
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
            </li>
            <li
              className={`nav-item nav-btn ${
                activeTab === "medicines" ? "active" : ""
              }`}
            >
              <button
                className="nav-link nav-btn"
                onClick={() => handleTabClick("medicines")}
              >
                Medicines
              </button>
            </li>
            <li
              className={`nav-item nav-btn ${
                activeTab === "orders" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("orders")}
              >
                Cart
              </button>
            </li>
            <li
              className={`nav-item nav-btn ${
                activeTab === "orderDetails" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("orderDetails")}
              >
                Order
              </button>
            </li>
            <li
              className={`nav-item nav-btn ${
                activeTab === "chat" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("chat")}
              >
                Chat
              </button>
            </li>
            <li
              className={`nav-item nav-btn ${
                activeTab === "settings" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("settings")}
              >
                Settings
              </button>
            </li>
            <li className="nav-item nav-btn">
              <button className="nav-btn nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="background-cover">
        <div className="container">
          {activeTab === "settings" && (
            <div className="card mt-4">
              <PatientProfile />
              <button
                className="btn btn-primary mt-2 d-inline-block w-auto"
                onClick={togglePasswordPopup}
              >
                {showPasswordPopup ? "Hide" : "Change Password"}
              </button>
              {showPasswordPopup && (
                <div className="popup">
                  <ChangePassword userType="pharmacist" />
                </div>
              )}{" "}
            </div>
          )}
          {activeTab === "medicines" && (
            <div className=" mt-4">
              {" "}
              {<Medicine sharedState={sharedState} modelName="patient" />}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="mt-4">
              <PatientChats setChats={setChats} chats={chats} />{" "}
              {/* Pass setChats and chats to PatientChats */}
            </div>
          )}
          {activeTab === "orders" && (
            <div className="container mt-4">
              <h3 className="font-cart">Cart Items</h3>
              <div>
                <ViewCartItems />
              </div>
            </div>
          )}
          {activeTab === "orderDetails" && (
            <div className="container mt-4">
              <div>
                <ViewAndCancelOrder />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Patient;
