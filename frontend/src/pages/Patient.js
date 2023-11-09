import React, { useState, useEffect } from "react";
import Medicine from "../components/Medicine";
import PatientActivities from "../components/PatientActivities";
import ViewCartItems from "../components/ViewCartItems";
import RemoveCartItem from "../components/RemoveCartItem";
import CancelOrder from "../components/CancelOrder";
import { useNavigate } from "react-router-dom";

const Patient = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/patient")
        if (response.status === 401 || response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();
  }, []);
  return (
    <div>
      <div className="mt-4">
      <h1 className="mb-4 text-center">Patient Dashboard</h1>
      {<Medicine modelName="patient"/>}
      {<PatientActivities modelName="patient"/>}
      </div>
      <div className="mt-4">
          <ViewCartItems />
        </div>

      <div className="mt-4">
          <RemoveCartItem />
        </div>

      <div className="mt-4">
          <CancelOrder />
        </div>
    </div>
  );
};

export default Patient;
