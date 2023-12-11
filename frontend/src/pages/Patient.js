import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Medicine from "../components/Medicine";
import PatientActivities from "../components/PatientActivities";
import ViewCartItems from "../components/ViewCartItems";
import ViewAndCancelOrder from "../components/viewAndCancelOrder";
import CheckingOut from "../components/CheckingOut";
import ChangePassword from "../components/ChangePassword";
import PatientChats from "../components/PatientChats";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Image from "../content/images/ELHANNY-LOGO.png";
import { Link } from 'react-router-dom';
import PatientProfile from "../components/patientProfile";
import "../styles/background.css";


const Patient = () => {
  const [sharedState, setSharedState] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]); // Add this line
  const [activeTab, setActiveTab] = useState("home");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const navigate = useNavigate();

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
      console.log('Chat closed:', chatId);
      setActiveChat(null);
      // Refresh the chat list by filtering out the closed chat
      setChats(chats.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.error('Error closing chat:', error);
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
            <div className='background-cover'></div>

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
        <li className={`nav-item ${activeTab === "home" ? "active" : ""}`}>
          <button
            className="nav-link"
            onClick={() => handleTabClick("home")}
          >
            Home
          </button>
        </li>
        <li
          className={`nav-item ${
            activeTab === "medicines" ? "active" : ""
          }`}
        >
          <button
            className="nav-link"
            onClick={() => handleTabClick("medicines")}
          >
            Medicines
          </button>
        </li>
        <li
          className={`nav-item ${
            activeTab === "orders" ? "active" : ""
          }`}
        >
          <button
            className="nav-link"
            onClick={() => handleTabClick("orders")}
          >
            Orders
          </button>
        </li>
        <li
          className={`nav-item ${
            activeTab === "chat" ? "active" : ""
          }`}
        >
          <button
            className="nav-link"
            onClick={() => handleTabClick("chat")}
          >
            Chat
          </button>
        </li>
        <li
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
        >
          <button
            className="nav-link"
            onClick={() => handleTabClick("settings")}
          >
            Settings
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  
</nav>
    <div className="container">
      
    <h1 className="mb-4 text-center">
    {activeTab === "orders" ? "Order Dashboard" : "Patient Dashboard"}
  </h1>
      {activeTab === "settings" && (
      <div className="card mt-4">
        <PatientProfile/>
        <button className="btn btn-primary mt-2 d-inline-block w-auto" onClick={togglePasswordPopup}>
          {showPasswordPopup ? "Hide" : "Change Password"}
          </button>
          {showPasswordPopup && (
            <div className="popup">
              <ChangePassword userType="pharmacist" />
            </div>
          )}      </div>)}
      {activeTab === "medicines" && (
      <div className="card mt-4"> {<Medicine sharedState={sharedState} modelName="patient" />}</div>)}
      
      {activeTab === "chat" && (
      <div className="card mt-4">
        <PatientChats setChats={setChats} chats={chats} /> {/* Pass setChats and chats to PatientChats */}
      </div>)}
      {activeTab === "orders" && (
      <div className="container card mt-4">
        <div >
          <ViewCartItems />
        </div>
      </div>)}
      
    </div>
    </div>
  );
};

export default Patient;
