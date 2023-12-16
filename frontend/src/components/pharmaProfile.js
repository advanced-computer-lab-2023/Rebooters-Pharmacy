// PharmacistProfile.js
import React, { useState, useEffect } from "react";
import ChangePassword from "../components/ChangePassword";


const PharmacistProfile = () => {
  const [pharmacistData, setPharmacistData] = useState({});
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);


  useEffect(() => {
    const fetchPharmacistData = async () => {
      try {
        // Make an API request to fetch pharmacist data
        const response = await fetch("/api/pharmacist/profile");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setPharmacistData(data);
      } catch (error) {
        console.error("Error fetching pharmacist data:", error.message);
      }
    };

    fetchPharmacistData();
  }, []);

  const togglePasswordPopup = () => {
    setShowPasswordPopup(!showPasswordPopup);
  };

  return (
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
            <div className="d-flex flex-column align-items-center text-center">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar8.png"  // Replace this with the URL of a woman's avatar image
                  alt="Pharmacist"
                  className="rounded-circle p-1 bg-primary"
                  width="110"
                />
                <div className="mt-3">
                  <h4>{pharmacistData.name}</h4>
                  <p className="text-secondary mb-1">{pharmacistData.affiliation}</p>
                </div>
              </div>
              <hr className="my-4" />
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
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                <span>{pharmacistData.name}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                <span>{pharmacistData.email}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Date of Birth</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                <span>{pharmacistData.dateOfBirth}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Hourly Rate</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{pharmacistData.hourlyRate}</span> 
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Affiliation</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{pharmacistData.affiliation}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Educational Background</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{pharmacistData.educationalBackground}</span>
                  
                </div>
              </div>
              
             
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Wallet</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{pharmacistData.wallet}</span> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PharmacistProfile;
