import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PharmReq = () => {
  const [newPharmacist, setNewPharmacist] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    hourlyRate: "",
    affiliation: "",
    educationalBackground: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null); 
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewPharmacist({
      ...newPharmacist,
      [name]: value,
    });
  };

  const handleAddPharmacist = async () => {
    if (
      !newPharmacist.username ||
      !newPharmacist.name ||
      !newPharmacist.email ||
      !newPharmacist.password ||
      !newPharmacist.dateOfBirth ||
      !newPharmacist.hourlyRate ||
      !newPharmacist.affiliation ||
      !newPharmacist.educationalBackground
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch("/api/guest/createNewPharmacistRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPharmacist),
      });

      if (response.ok) {
        setSubmissionStatus("success");
        setMessage("Pharmacist added successfully!");
        setNewPharmacist({
          username: "",
          name: "",
          email: "",
          password: "",
          dateOfBirth: "",
          hourlyRate: "",
          affiliation: "",
          educationalBackground: "",
        });
        console.log("Pharmacist added successfully!");
      } else {
        setSubmissionStatus("error");
        setMessage("Error adding pharmacist to the database.");
        console.error("Error adding pharmacist to the database.");
      }
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("An error occurred while adding the pharmacist: " + error.message);
      console.error("An error occurred while adding the pharmacist:", error);
    }
  };

  return (
    <div className="card container mt-4">
      <div className="card-body">
        <h2>Request to register as a Pharmacist</h2>
        {submissionStatus === "success" && (
          <div className="alert alert-success">{message}</div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={newPharmacist.username}
            onChange={handleInputChange}
          />
        </div>
       
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={newPharmacist.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={newPharmacist.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={newPharmacist.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateOfBirth" className="form-label">
            Date of Birth:
          </label>
          <input
            type="date"
            className="form-control"
            id="dateOfBirth"
            name="dateOfBirth"
            value={newPharmacist.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="hourlyRate" className="form-label">
            Hourly Rate:
          </label>
          <input
            type="text"
            className="form-control"
            id="hourlyRate"
            name="hourlyRate"
            value={newPharmacist.hourlyRate}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="affiliation" className="form-label">
            Affiliation:
          </label>
          <input
            type="text"
            className="form-control"
            id="affiliation"
            name="affiliation"
            value={newPharmacist.affiliation}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="educationalBackground" className="form-label">
            Educational Background:
          </label>
          <input
            type="text"
            className="form-control"
            id="educationalBackground"
            name="educationalBackground"
            value={newPharmacist.educationalBackground}
            onChange={handleInputChange}
          />
          </div>
        <button className="btn btn-primary" onClick={handleAddPharmacist}>
          Request to be a Pharmacist
          
        </button>
      </div>
    </div>
  );
};

export default PharmReq;
