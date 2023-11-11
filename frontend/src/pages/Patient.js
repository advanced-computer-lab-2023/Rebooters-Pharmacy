import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Medicine from "../components/Medicine";
import PatientActivities from "../components/PatientActivities";
import ViewCartItems from "../components/ViewCartItems";
import ViewAndCancelOrder from "../components/viewAndCancelOrder";
import CheckingOut from "../components/CheckingOut";
import ChangePassword from "../components/ChangePassword";

const Patient = () => {
  const [sharedState, setSharedState] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/patient");
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
    <div className="container">
      <button onClick={handleLogout} className="btn btn-danger mt-2">
        Logout
      </button>
      <h1 className="mb-4 text-center">Patient Dashboard</h1>
      <div className="card mt-4">
        <ChangePassword userType="patient" />
      </div >
      <div className="card mt-4"> {<Medicine sharedState={sharedState} modelName="patient" />}</div>
      <div className="card mt-4">{<PatientActivities modelName="patient" />}</div>
      <div className="container card mt-4">
      <h3>Order CheckOut </h3>
      <div>
        <ViewCartItems />
      </div>
      <div >{<CheckingOut sharedState={sharedState} setSharedState={setSharedState} modelName="patient" />}</div>
      </div>


      <div className="card mt-4">
        <ViewAndCancelOrder />
      </div>
    </div>
  );
};

export default Patient;
