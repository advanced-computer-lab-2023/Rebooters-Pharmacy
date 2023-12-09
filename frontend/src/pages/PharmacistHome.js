import React, { useState, useEffect } from "react";
import AddMedicine from "../components/addMedicine";
import EditMedicine from "../components/editMedicine";
import ViewMedicineQuantitySales from "../components/ViewMedicineQuantitySales";
import Medicine from "../components/Medicine";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ChangePassword from "../components/ChangePassword";
import PharmacistChats from "../components/PharmacistChats";
import Notifications from "../components/PharmacistNotifications"; // Import the Notifications component
import SalesReportGenerator from "../components/Repo";
import Wallet from "../components/Wallet";
import MedicineDropdown from "../components/filterRepo";
import Pharmacist_DoctorChats from "../components/Pharmacist_DoctorChats";
import PharmacistRespondToDoc from "../components/PharmacistRespondToDoc";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from "../content/images/ELHANNY-LOGO.png";
import PharmacistProfile from "../components/pharmaProfile"; // Import the new component

const PharmacistHome = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/pharmacist");
        if (response.status === 401 || response.status === 403) {
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
      if (activeChat) {
        await closeActiveChat(activeChat);
      }
      const response = await fetch("/api/pharmacist/logout", {
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
      await axios.delete(`/api/pharmacist/deleteChat/${chatId}`);
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
  const handleFilter = (medicine) => {
    // Handle the filter logic here
    console.log('Filtering by medicine:', medicine);
    // You can add more logic or state updates based on the selected medicine
  };
  const togglePasswordPopup = () => {
    setShowPasswordPopup(!showPasswordPopup);
  };
  return (
    <div>
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
      <h1 className="mb-4 text-center">Pharmacist Dashboard</h1>
      {activeTab === "settings" && (
        <div className="card mt-4">
          <PharmacistProfile/>
          <button className="btn btn-primary mt-2 d-inline-block w-auto" onClick={togglePasswordPopup}>
          {showPasswordPopup ? "Hide" : "Change Password"}
          </button>
          {showPasswordPopup && (
            <div className="popup">
              <ChangePassword userType="pharmacist" />
            </div>
          )}        </div>
      )}
      {activeTab === "chat" && (
        <div className="card mt-4">
          <PharmacistChats />
          <PharmacistRespondToDoc/>
        </div>
      )}
      {activeTab === "home" && (
        <div>
          <Wallet userType="pharmacist" />
        </div>
      )}
      {activeTab === "home" && (
        <div className="card mt-4">
          <Notifications />
        </div>
      )}
      {activeTab === "chat" && (
      <div className="card mt-4">
        <Pharmacist_DoctorChats setChats={setChats} chats={chats} /> 
      </div>)}
      {activeTab === "medicines" && (
        <div className="mt-4">{<Medicine modelName="pharmacist" />}</div>
      )}
      {activeTab === "medicines" && (
        <div className="mt-4">
          <AddMedicine />
        </div>
      )}
      {/*{activeTab === "medicines" && (
        <div className="mt-4">
          <EditMedicine />
        </div>
      )}*/}

      {activeTab === "home" && (
        <div className="mt-4">
          <h2 className="mb-4 mt-4 text-center">Sales Report</h2>
          <SalesReportGenerator userType="pharmacist"/>
        </div>
      )}
      {activeTab === "home" && (
        <div className="mt-4">
          <h2 className="mb-4 mt-4 text-center">Filtered Repo </h2>
          <MedicineDropdown handleFilter={handleFilter} />
        </div>
      )}
    </div>
    </div>
  );
};

export default PharmacistHome;
