// AdminProfile.js
import React, { useState, useEffect } from "react";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Make an API request to fetch admin data
        const response = await fetch("/api/administrator/profile");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error("Error fetching admin data:", error.message);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                  alt="Admin"
                  className="rounded-circle p-1 bg-primary"
                  width="110"
                />
                <div className="mt-3">
                  <h4>{adminData.username}</h4>
                  <p className="text-secondary mb-1">Administrator</p>
                </div>
              </div>
              <hr className="my-4" />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Username</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{adminData.username}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{adminData.email}</span>
                </div>
              </div>
              {/* Add other fields based on your Admin model */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
