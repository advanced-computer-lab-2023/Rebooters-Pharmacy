import React, { useState, useEffect } from "react";
import AddMedicine from "../components/addMedicine";
import EditMedicine from "../components/editMedicine";
import ViewMedicineQuantitySales from "../components/ViewMedicineQuantitySales";
import Medicine from "../components/Medicine";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ChangePassword from "../components/ChangePassword";
import PharmacistChats from "../components/PharmacistChats";
import Notifications from '../components/PharmacistNotifications'; // Import the Notifications component
import SalesReportGenerator from "../components/Repo";


const PharmacistHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/pharmacist")
        if (response.status === 401 ||response.status === 403) {
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
  
    return (
      <div className="container">
   <button onClick={handleLogout} className="btn btn-danger mt-2">
        Logout
      </button>
        <h1 className="mb-4 text-center">Pharmacist Dashboard</h1>
        <div className="card mt-4">
        <ChangePassword userType="pharmacist" />
      </div>
      <div className="card mt-4">
        <PharmacistChats/>
      </div>
      <div className="card mt-4">
        <Notifications /> 
      </div>
        <div className="mt-4">
        {<Medicine modelName="pharmacist"/>}
        </div>
        <div className="mt-4">
          <AddMedicine />
        </div>
        <div className="mt-4">
          <EditMedicine />
        </div>
        <h2 className="mb-4 mt-4 text-center">Request to view REPO</h2>
      <div className="mt-4">
        <SalesReportGenerator />
      </div>
        {/* <div className="mt-4">
          <ViewMedicineQuantitySales />
        </div> */}
      </div>
      
    );
  };
  
  export default PharmacistHome;
  