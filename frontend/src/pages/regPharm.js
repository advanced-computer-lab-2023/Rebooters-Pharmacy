import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pharmacistrequest.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import "../styles/background.css";
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
    idDocument: null,
    pharmacyDegreeDocument: null,
    workingLicenseDocument: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const onCancel = () => {
    navigate("/homePage");
  };
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setNewPharmacist({
        ...newPharmacist,
        [name]: files[0], // Assuming only one file is uploaded
      });
    } else {
      setNewPharmacist({
        ...newPharmacist,
        [name]: e.target.value,
      });
    }
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
      !newPharmacist.educationalBackground ||
      !newPharmacist.idDocument ||
      !newPharmacist.pharmacyDegreeDocument ||
      !newPharmacist.workingLicenseDocument
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    for (let key in newPharmacist) {
      formData.append(key, newPharmacist[key]);
    }
    try {
      const response = await fetch("/api/guest/createNewPharmacistRequest", {
        method: "POST",
        body: formData,
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
          idDocument: null,
          pharmacyDegreeDocument: null,
          workingLicenseDocument: null,
        });
        console.log("Pharmacist added successfully!");
      } else {
        setSubmissionStatus("error");
        setMessage("Error adding pharmacist to the database.");
        console.error("Error adding pharmacist to the database.");
      }
    } catch (error) {
      setSubmissionStatus("error");
      setMessage(
        "An error occurred while adding the pharmacist: " + error.message
      );
      console.error("An error occurred while adding the pharmacist:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="background-cover">
        <div className="register-container">
          <div className="request-form-container card container mt-4">
            <div className="request-form card-body">
              <h2 className="mb-4 mt-4 text-center">
                Request to register as a Pharmacist
              </h2>

              <h4>Please fill in these details:</h4>
              {submissionStatus === "success" && (
                <div className="alert alert-success">{message}</div>
              )}
              {submissionStatus === "error" && (
                <div className="alert alert-danger">{message}</div>
              )}
              <div className="row">
                <div className="col-4 mb-3">
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

                <div className="col-4 mb-3">
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
                <div className="col-4 mb-3">
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
              </div>
              <div className="row">
                <div className="col-4 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>

                  <input
                    className="form-control"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={newPharmacist.password}
                    onChange={handleInputChange}
                  />

                  <input
                    style={{ marginLeft: "4px" }}
                    type="checkbox"
                    id="togglePassword"
                    className="toggle-password-checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label htmlFor="togglePassword" style={{ marginLeft: "5px" }}>
                    Show Password
                  </label>
                </div>
                <div className="col-4 mb-3">
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
                <div className="col-4 mb-3">
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
              </div>
              <div className="row">
                <div className="col-4 mb-3">
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
                <div className="col-4 mb-3">
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
                <div className="col-4 mb-3">
                  <label htmlFor="idDocument" className="form-label">
                    ID Document:
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="idDocument"
                    name="idDocument"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-4 mb-3">
                  <label
                    htmlFor="pharmacyDegreeDocument"
                    className="form-label"
                  >
                    Pharmacy Degree Document:
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="pharmacyDegreeDocument"
                    name="pharmacyDegreeDocument"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-4 mb-3">
                  <label
                    htmlFor="workingLicenseDocument"
                    className="form-label"
                  >
                    Working License Document:
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="workingLicenseDocument"
                    name="workingLicenseDocument"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-submit">
                <button
                  className="btn btn-primary btn-default-width"
                  onClick={handleAddPharmacist}
                >
                  Send request
                </button>
                <button
                  className="btn btn-secondary btn-default-width"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PharmReq;
