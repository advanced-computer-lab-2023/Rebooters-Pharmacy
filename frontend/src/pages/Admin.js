import React, { useState, useEffect } from "react";
import Medicine from "../components/Medicine";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../components/ChangePassword";
import SalesReportGenerator from "../components/Repo";
import { Link } from 'react-router-dom';
import Image from "../content/images/ELHANNY-LOGO.png";

function Administrator() {
  //const [administrators, setAdministrators] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pharmacistUsername, setPharmacistUsername] = useState("");
  const [patientUsername, setPatientUsername] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [email, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userToRemove, setUserToRemove] = useState("");
  const [newPharmacistRequestData, setNewPharmacistRequestData] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [showPharmacistRequests, setshowPharmacistRequests] = useState(false);
  const [showPharmacistDetails, setShowPharmacistDetails] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [submissionStatusRequest, setSubmissionStatusRequest] = useState(null);  
  const [submissionStatusviewPharmacists, setSubmissionviewPharmacists] = useState(null);     
  const [SubmissionStatusViewPatient, setSubmissionStatusViewPatient] = useState(null); 
  const [submissionStatusRemove, setSubmissionStatusRemove] = useState(null);


  /*const viewAdministrators = async () => {
    try {
      const response = await fetch(`/api/administrator/viewAdministrators`);
      if (!response.ok) {
        throw new Error("Failed to fetch administrators");
      }
      const data = await response.json();
      setAdministrators(data);
    } catch (error) {
      console.error(error);
    }
  };*/


  const navigate = useNavigate();
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/admin");
        if (response.status === 401 || response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };
console.log(checkUserType());
    checkUserType();
  }, []);


  const handlePharmacistUsernameChange = (e) => {
    // Clear the error message when the user starts typing
    setSubmissionviewPharmacists(null);
    setMessage("");
    setPharmacistUsername(e.target.value);
  };

  const handlePatientUsernameChange = (e) => {
    // Clear the error message when the user starts typing
    setSubmissionStatusViewPatient(null);
    setMessage("");
    setPatientUsername(e.target.value);
  };

  const handleRemoveChange = (e) => {
    // Clear the error message when the user starts typing
    setSubmissionStatusRemove(null);
    setMessage("");
    setUserToRemove(e.target.value);
  };


  const viewPharmacists = async () => {
    if (!pharmacistUsername) {
      setSubmissionviewPharmacists("error");
      setMessage("Please fill the field.");
      return;
    }
    try {
      const response = await fetch(
        `/api/administrator/viewPharmacistInformation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pharmacistUsername: pharmacistUsername }),
        }
      );
      if (!response.ok) {
        setSubmissionviewPharmacists("error");
        setMessage("Failed to fetch pharmacists");
        throw new Error("Failed to fetch pharmacists");
      }
      const data = await response.json();
      if (!data || data.length === 0) {
        setSubmissionviewPharmacists("error");
        setMessage("Pharmacist not found");
        return;
      }
      setPharmacists(data);
      setShowPharmacistDetails(true);
    } catch (error) {
      setSubmissionviewPharmacists("error");
      setMessage("Failed to fetch pharmacists");
      console.error(error);
    }
  };

  const toggleViewPharmacists = () => {
    if (!showPharmacistDetails) {
      viewPharmacists();
    } else {
      setShowPharmacistDetails(false);
    }
  };

  const viewPatients = async () => {
    if (!patientUsername) {
      setSubmissionStatusViewPatient("error");
      setMessage("Please fill the field.");
      return;
    }
    try {
      const response = await fetch(
        `/api/administrator/viewPatientInformation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientUsername: patientUsername }),
        }
      );
      if (!response.ok) {
        setSubmissionStatusViewPatient("error");
        setMessage("Failed to fetch patients");
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      if (!data || data.length===0) {
        setSubmissionStatusViewPatient("error");
        setMessage("Patient not found");
      }

      setPatients(data);
      setShowPatientDetails(true);
    } catch (error) {
      setSubmissionStatusViewPatient("error");
      setMessage("Failed to fetch patients");
      console.error(error);
    }
  };

  const toggleViewPatients = () => {
    if (!showPatientDetails) {
      viewPatients();
    } else {
      setShowPatientDetails(false);
    }
  };

  const addAdministrator = async () => {
    if (!adminUsername || !password || !email) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`/api/administrator/addAdministrator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: adminUsername, password, email }),
      });
      if (!response.ok) {
        setSubmissionStatus("error");
        setMessage("Failed to add administrator");
        throw new Error("Failed to add administrator");
      }
      //const data = await response.json();
      setSubmissionStatus("success");
      setMessage("Administrator added successfully");
      console.log("Administrator added successfully");
      setAdminUsername("");
      setPassword("");
      setAdminEmail("");
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("Failed to add administrator");
      console.error(error);
    }
  };

  const removeUserFromSystem = async () => {
    if (!userToRemove) {
      setSubmissionStatusRemove("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(`/api/administrator/removeUserFromSystem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userToRemove }),
      });
      if (!response.ok) {
        setSubmissionStatusRemove("error");
        setMessage("Failed to remove pharmacist/patient");
        throw new Error("Failed to remove pharmacist/patient");
      }
      console.log("Pharmacist/patient removed successfully");
      setUserToRemove("");
      setSubmissionStatusRemove("success");
      setMessage("Pharmacist/patient removed successfully");
    } catch (error) {
      console.error(error);
      setSubmissionStatusRemove("error");
      setMessage("User not found");
    }
  };

  const viewNewPharmacistRequests = async () => {
    try {
      const response = await fetch(
        "/api/administrator/viewPharmacistApplication"
      );
      if (!response.ok) {
        setSubmissionStatusRequest("error");
        setMessage("Failed to fetch new pharmacist requests");
        throw new Error("Failed to fetch new pharmacist requests");
      }
      const data = await response.json();
      if (data.length == 0) {
        setSubmissionStatusRequest("error");
        setMessage("There are no pharmacist requests");
      }
      else{
        setNewPharmacistRequestData(data);
        setshowPharmacistRequests(true);
      }
      
    } catch (error) {
      setSubmissionStatusRequest("error");
      setMessage("Failed to fetch new pharmacist requests");
      console.error(error);
    }
  };

  const approvePharmacistRequest = async (username) => {
    try {
      const response = await fetch(
        "/api/administrator/approvePharmacistRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );
      if (response.ok) {
        const updatedRequests = newPharmacistRequestData.filter(
          (request) => request.username !== username
        );
        setNewPharmacistRequestData(updatedRequests);
        // Show success message or update UI as needed
      } else {
        // Handle HTTP error codes (response status not OK)
        throw new Error("Failed to approve pharmacist request"); // Throw a new error to be caught in the catch block
      }
    } catch (error) {
      // Handle network errors or exceptions during the fetch
      console.error("Error approving pharmacist request:", error);
      // Update the state or show an error message to the user
      // For example, set a state to display an error message on the UI
    }
  };

  const rejectPharmacistRequest = async (username) => {
    try {
      const response = await fetch(
        "/api/administrator/rejectPharmacistRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );
      if (response.ok) {
        const updatedRequests = newPharmacistRequestData.filter(
          (request) => request.username !== username
        );
        setNewPharmacistRequestData(updatedRequests);
      } else {
        // Handle HTTP error codes (response status not OK)
        throw new Error("Failed to reject pharmacist request"); // Throw a new error to be caught in the catch block
      }
    } catch (error) {
      // Handle network errors or exceptions during the fetch
      console.error("Error rejecting pharmacist request:", error);
      // Update the state or show an error message to the user
      // For example, set a state to display an error message on the UI
    }
  };

  const downloadDocument = async (fileName) => {
    const link = document.createElement("a");
    const url = fileName;
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const togglePharmacistRequests = () => {
    
    if (!showPharmacistRequests) {
      viewNewPharmacistRequests();
    } else {
      setshowPharmacistRequests(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/administrator/logout", {
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
    <div>
          <nav className="navbar navbar-expand-lg navbar-dark " style={{backgroundColor: "#44bab1"}}>
      <img src={Image} width="60"/>
        <Link to="/" className="navbar-brand"><span>el7a2ni</span></Link>
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
          <ul className="navbar-nav">
          <li className={`nav-item ${activeTab === "home" ? "active" : ""}`}>
              <button
                className="nav-link"
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
            </li>
            <li
              className={`nav-item ${
                activeTab === "medicines" ? "active" : ""
              }`}
            >
              <button
                className="nav-link"
                onClick={() => handleTabClick("medicines")}
              >
                Medicines
              </button>
            </li>
            <li
              className={`nav-item ${
                activeTab === "administrators" ? "active" : ""
              }`}
            >
              <button
                className="nav-link"
                onClick={() => handleTabClick("administrators")}
              >
                Administrators
              </button>
            </li>
            <li
              className={`nav-item ${
                activeTab === "usermanager" ? "active" : ""
              }`}
            >
              <button
                className="nav-link"
                onClick={() => handleTabClick("usermanager")}
              >
                User Manager
              </button>
            </li>
            <li
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            >
              <button
                className="nav-link"
                onClick={() => handleTabClick("settings")}
              >
                Settings
              </button>
            </li>
            <li>
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
    </nav>
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Administrator Dashboard</h1>
      {activeTab === "settings" && (
        <div className="card mt-4">
          <ChangePassword userType="administrator" />
        </div>
      )}
      {submissionStatus === "success" && (
        <div className="alert alert-success">{message}</div>
      )}
      {submissionStatus === "error" && (
        <div className="alert alert-danger">{message}</div>
      )}
      <br />
      {activeTab === "administrators" && (
        <div className="card mb-3">
          <h2>Add Administrator</h2>
          <input
            type="text"
            placeholder="Administrator Username"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="text"
            placeholder="Administrator Email"
            value={email}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="form-control mb-2"
          />
          <div>
            <button className="btn btn-primary" onClick={addAdministrator}>
              Add Administrator
            </button>
          </div>
        </div>
      )}
      {activeTab === "usermanager" && (
        <div className="card mb-3">
          <h2>Search for Pharmacist</h2>
          {submissionStatusviewPharmacists === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
          <input
            type="text"
            placeholder="Pharmacist Username"
            value={pharmacistUsername}
            onChange={handlePharmacistUsernameChange}
            className="form-control mb-2"
          />
          <div>
            <button className="btn btn-primary" onClick={toggleViewPharmacists}>
              {showPharmacistDetails ? "Hide Pharmacist" : "Search Pharmacist"}
            </button>
          </div>
        </div>
      )}
      {activeTab === "usermanager" && (
        <div>
          {showPharmacistDetails && pharmacists.length > 0 && (
            <div>
              <h4>Search Results</h4>
              <ul>
                {pharmacists.map((result) => (
                  <li key={result.id}>
                    <p>ID: {result._id}</p>
                    <p>Name: {result.name}</p>
                    <p>Email: {result.email}</p>
                    <p>
                      Date of Birth:{" "}
                      {new Date(result.dateOfBirth).toLocaleDateString()}
                    </p>
                    <p>Affiliation: {result.affiliation}</p>
                    <p>
                      Educational Background: {result.educationalBackground}
                    </p>
                    <p>Hourly Rate: {result.hourlyRate}</p>
                    <p>Status: {result.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {activeTab === "usermanager" && (
        <div className="card mb-3">
          <h2>Search for Patient</h2>
          {SubmissionStatusViewPatient === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
          <input
            type="text"
            placeholder="Patient Username"
            value={patientUsername}
            onChange={handlePatientUsernameChange}
            className="form-control mb-2"
          />
          <div>
            {" "}
            <button className="btn btn-primary" onClick={toggleViewPatients}>
              {showPatientDetails ? "Hide Patient" : "Search Patient"}
            </button>
          </div>
        </div>
      )}
      {activeTab === "usermanager" && (
        <div>
          {showPatientDetails && patients.length > 0 && (
            <div>
              <h4>Search Results</h4>
              <ul>
                {patients.map((result) => (
                  <li key={result.id}>
                    <p>ID: {result._id}</p>
                    <p>Name: {result.name}</p>
                    <p>Email: {result.email}</p>
                    <p>
                      Date of Birth:{" "}
                      {new Date(result.dateOfBirth).toLocaleDateString()}
                    </p>
                    <p>Gender: {result.gender}</p>
                    <p>Mobile Phone: {result.mobile_number}</p>
                    <p>
                      Emergency Contact First Name:{" "}
                      {result.emergency_contact.firstName}
                    </p>
                    <p>
                      Emergency Contact Middle Name:{" "}
                      {result.emergency_contact.middleName}
                    </p>
                    <p>
                      Emergency Contact Last Name:{" "}
                      {result.emergency_contact.lastName}
                    </p>
                    <p>
                      Emergency Contact Mobile Phone:{" "}
                      {result.emergency_contact.mobile_number}
                    </p>
                    <p>
                      Emergency Contact Relation:{" "}
                      {result.emergency_contact.relation}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {activeTab === "home" && (
        <div className="mt-4">
          <h2 className="mb-4 mt-4 text-center">Request to view REPO</h2>
          <SalesReportGenerator userType="administrator"/>
        </div>
      )}
      {activeTab === "usermanager" && (
        <div className="card mt-4">
          <h2>Pharmacist/Patient to remove</h2>
          {submissionStatusRemove === "error"  && (
          <div className="alert alert-danger">{message}</div>
        )}
        {submissionStatusRemove === "success"  && (
          <div className="alert alert-success">{message}</div>
        )}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username to Remove"
              value={userToRemove}
              onChange={handleRemoveChange}
              className="form-control"
            />
            <div>
              <button
                className="btn btn-danger mt-2"
                onClick={removeUserFromSystem}
              >
                Remove Pharmacist/Patient
              </button>
              {submissionStatus === "success" && (
                <div className="alert alert-success mt-2">{message}</div>
              )}
              {submissionStatus === "error" && (
                <div className="alert alert-danger mt-2">{message}</div>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab === "usermanager" && (
        <div className="card mt-4">
          <h2>New Pharmacist Requests</h2>
          {submissionStatusRequest === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
          <div>
            <button
              className="btn btn-primary"
              onClick={togglePharmacistRequests}
            >
              {showPharmacistRequests
                ? "Hide New Pharmacist Requests"
                : "View New Pharmacist Requests"}
            </button>
          </div>
          {showPharmacistRequests && newPharmacistRequestData.length > 0 &&(
            <table className="table mt-2">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date of Birth</th>
                  <th>Hourly Rate</th>
                  <th>Affiliation</th>
                  <th>Educational Background</th>
                  <th>ID Document</th>
                  <th>Pharmacy Degree</th>
                  <th>Working License</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {newPharmacistRequestData.map(
                  (request) => (
                    console.log(request.idDocument),
                    console.log(request.pharmacyDegreeDocument),
                    console.log(request.workingLicenseDocument),
                    (
                      <tr key={request._id}>
                        <td>{request.username}</td>
                        <td>{request.name}</td>
                        <td>{request.email}</td>
                        <td>{request.dateOfBirth}</td>
                        <td>{request.hourlyRate}</td>
                        <td>{request.affiliation}</td>
                        <td>{request.educationalBackground}</td>
                        <td>
                          {request.idDocument && (
                            <button
                              className="btn btn-info"
                              onClick={() =>
                                downloadDocument(request.idDocument.filename)
                              }
                            >
                              Download ID Document
                            </button>
                          )}
                        </td>
                        <td>
                          {request.pharmacyDegreeDocument && (
                            <button
                              className="btn btn-info"
                              onClick={() =>
                                downloadDocument(
                                  request.pharmacyDegreeDocument.filename
                                )
                              }
                            >
                              Download Pharmacy Degree Document
                            </button>
                          )}
                        </td>
                        <td>
                          {request.workingLicenseDocument && (
                            <button
                              className="btn btn-info"
                              onClick={() =>
                                downloadDocument(
                                  request.workingLicenseDocument.filename
                                )
                              }
                            >
                              Download Working License Document
                            </button>
                          )}
                        </td>
                        <td>
                          {request.status === "pending" ? (
                            <div>
                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  approvePharmacistRequest(request.username)
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  rejectPharmacistRequest(request.username)
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            "Request Handled"
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
                
              </tbody>
            </table>
          )}
        </div>
      )}
      {activeTab === "medicines" && (
        <div className="mt-4">{<Medicine modelName="administrator" />}</div>
      )}
    </div>
    </div>
  );
}

export default Administrator;
