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

const PharmacistHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/pharmacist");
        if (response.status === 401 || response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();
  }, []);

  const handleLogout = async () => {
    try {
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li>
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
            <li className={`nav-item ${activeTab === "home" ? "active" : ""}`}>
              <button
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
            </li>
            <li
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            >
              <button
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("settings")}
              >
                Settings
              </button>
            </li>
            <li
              className={`nav-item ${
                activeTab === "medicines" ? "active" : ""
              }`}
            >
              <button
                className="nav-link btn btn-link"
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
                className="nav-link btn btn-link"
                onClick={() => handleTabClick("chat")}
              >
                Chat
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <h1 className="mb-4 text-center">Pharmacist Dashboard</h1>
      {activeTab === "settings" && (
        <div className="card mt-4">
          <ChangePassword userType="pharmacist" />
        </div>
      )}
      {activeTab === "chat" && (
        <div className="card mt-4">
          <PharmacistChats />
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
          <EditMedicine />
        </div>
      )}

      {activeTab === "home" && (
        <div className="mt-4">
          <h2 className="mb-4 mt-4 text-center">Request to view REPO</h2>
          <SalesReportGenerator />
        </div>
      )}
      {/* <div className="mt-4">
          <ViewMedicineQuantitySales />
        </div> */}
    </div>
  );
};

export default PharmacistHome;
