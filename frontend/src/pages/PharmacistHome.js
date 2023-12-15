import React, { useState, useEffect } from "react";
import "../styles/background.css";
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
import Pharmacist_DoctorChats from "../components/Pharmacist_DoctorChats";
import PharmacistRespondToDoc from "../components/PharmacistRespondToDoc";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../content/images/ELHANNY-LOGO.png";
import PharmacistProfile from "../components/pharmaProfile"; // Import the new component
import ChatWithDoctor from "../components/ChatWithDoctor";
import Footer from "../components/footer";
import ChatNavbar from "../components/ChatNavbar";
import ChatBox from "../components/ChatBox";
import ki from "../content/images/ki.jpg";
import BarChart from "../components/ProfitBarChartPharm";
import "../styles/pharmHome.css";


const PharmacistHome = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showChat, setShowChat] = useState(false);

  

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
  const handleFilter = (medicine) => {
    // Handle the filter logic here
    console.log("Filtering by medicine:", medicine);
    // You can add more logic or state updates based on the selected medicine
  };
  const togglePasswordPopup = () => {
    setShowPasswordPopup(!showPasswordPopup);
  };

  
  const handleChatButtonClick = (component) => {
    setActiveComponent(component);
  };


  return (
    <div>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "white" }}
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
              className={`nav-btn nav-item ${
                activeTab === "home" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
            </li>
            <li
              className={`nav-btn nav-item ${
                activeTab === "medicines" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("medicines")}
              >
                Medicines
              </button>
            </li>
            <li
              className={`nav-btn nav-item ${
                activeTab === "notification" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("notification")}
              >
                Notifications
              </button>
            </li>
            <li
              className={`nav-item nav-btn ${
                activeTab === "settings" ? "active" : ""
              }`}
            >
              <button
                className="nav-link nav-btn"
                onClick={() => handleTabClick("settings")}
              >
                Settings
              </button>
            </li>
            <li className="nav-btn nav-item">
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
              <PharmacistProfile />
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
          {activeTab === "notification" && (
          <div>
            <Notifications />
          </div>
          )}
          {activeTab === "home" && (
  <div className="home-container">
    <div className="slogan-container">
      <img src={ki} alt="Your Image Alt Text" className="slogan-image" />
      <p className="slogan-text">
        <span className="slogan-highlight">Empowering Health,</span>
        <br />
        Serving with Care
      </p>
      <div className="wallet-container">
      <Wallet userType="pharmacist" />
    </div>
    </div>

    {/* Opening Hours Table Container */}
    <div className="opening-hours-container">
  <h2 style={{ textAlign: 'center' }}>Opening Hours</h2>
  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f2f2f2' }}>
    <tbody>
      <tr style={{ borderBottom: '7px solid #ddd' }}>
        <th style={{ padding: '13px', textAlign: 'center', border: '1px solid #ddd', backgroundColor: '#44bab1' }}>Day</th>
        <th style={{ padding: '13px', textAlign: 'center', border: '1px solid #ddd',backgroundColor: '#44bab1' }}>Hours</th>
      </tr>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Monday</td>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>9:00 AM - 6:00 PM</td>
      </tr>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Tuesday</td>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>9:00 AM - 6:00 PM</td>
      </tr>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Wednesday</td>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>9:00 AM - 6:00 PM</td>
      </tr>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Thursday</td>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>9:00 AM - 6:00 PM</td>
      </tr>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Friday</td>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>9:00 AM - 6:00 PM</td>
      </tr>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Saturday</td>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>10:00 AM - 4:00 PM</td>
      </tr>
      <tr>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Sunday</td>
        <td style={{ padding: '10px', textAlign: 'center', border: '4px solid #ddd' }}>Closed</td>
      </tr>
    </tbody>
  </table>

</div>


    <div className="barchart-container">
      <BarChart />
    </div>
    
  </div>
)}

          {activeTab === "medicines" && (
            <div className="mt-4">{<Medicine modelName="pharmacist" />}</div>
          )}
          {activeTab === "medicines" && (
            <div className="mt-4">
              <AddMedicine />
            </div>
          )}
          

          {activeTab === "medicines" && (
            <div className="mt-4">
              <h2 className="mb-4 mt-4 text-center">Sales Report</h2>
              <SalesReportGenerator userType="pharmacist" />
            </div>
          )}
          <ChatBox/>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PharmacistHome;
