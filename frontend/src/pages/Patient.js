import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Medicine from "../components/Medicine";
import PatientActivities from "../components/PatientActivities";
import ViewCartItems from "../components/ViewCartItems";
import ViewAndCancelOrder from "../components/viewAndCancelOrder";
import CheckingOut from "../components/CheckingOut";
import ChangePassword from "../components/ChangePassword";

const Patient = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/patient")
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

  return (
    <div>
      <div className="mt-4">
       <button onClick={handleLogout} className="btn btn-danger mt-2">
        Logout
      </button>
      <h1 className="mb-4 text-center">Patient Dashboard</h1>
      <div className="card mt-4">
        <ChangePassword userType="patient" />
      </div>
      {<Medicine modelName="patient"/>}
      
      {<PatientActivities modelName="patient"/>}
      {<CheckingOut modelName="patient"/>}
      </div>
      <div className="mt-4">
          <ViewCartItems />
        </div>

      
      <div className="mt-4">
          <ViewAndCancelOrder />
        </div>
    </div>
  );
};

export default Patient;
