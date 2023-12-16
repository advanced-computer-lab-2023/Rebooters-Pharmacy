import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import "../styles/background.css";
import "../styles/repoAdmin.css";
import Medicine from "../components/Medicine";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../components/ChangePassword";
import SalesReportGenerator from "../components/Repo";
import { Link } from "react-router-dom";
import Image from "../content/images/ELHANNY-LOGO.png";
import AdminProfile from "../components/AdminProfile";
import Footer from "../components/footer";
import UserPieChart from "../components/UserPieChart";
import UserCardsTotal from "../components/UserCardsTotal";
import ProfitBarChart from "../components/ProfitBarChart";
import MedicinePrescriptionChart from "../components/MedicinePrescriptionChart";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Carousel from 'react-bootstrap/Carousel';
import pharmacist from '../content/images/pharmacist.png';
import patient from '../content/images/patient.jpg';
import remove from '../content/images/patient-pharmacist.jpg';
import addAdmin from '../content/images/addAdmin.gif';
import slideAdmin from '../content/images/slideAdmin.png';


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
  const [submissionStatusviewPharmacists, setSubmissionviewPharmacists] =useState(null);
  const [SubmissionStatusViewPatient, setSubmissionStatusViewPatient] =useState(null);
  const [submissionStatusRemove, setSubmissionStatusRemove] = useState(null);
  const [submissionStatusAdmin, setSubmissionStatusAdmin] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const [searchTermPharmacist, setSearchTermPharmacist] = useState("");
  const [suggestedPharmacistUsernames, setSuggestedPharmacistUsernames] = useState([]);
  const [showPharmacistDropdown, setShowPharmacistDropdown] = useState(false);
  
  const [searchTermPatient, setSearchTermPatient] = useState("");
  const [suggestedPatientUsernames, setSuggestedPatientUsernames] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);


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
    try {
      if (!searchTermPharmacist.trim()) {
        return;
      }
      const response = await fetch(`/api/administrator/viewPharmacistInformation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pharmacistUsername: searchTermPharmacist }),
      });
  
      if (!response.ok) {
        setSubmissionviewPharmacists("error");
        setMessage("Failed to fetch pharmacists");
        throw new Error("Failed to fetch pharmacists");
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (!data || data.length === 0) {
        setSubmissionviewPharmacists("error");
        setMessage(`No pharmacist found with the username "${searchTermPharmacist}".`);
        setPharmacists([]);

        return;
      }
  
      // Make sure you are handling the data correctly
      console.log("Processed Data:", data.map((pharmacist) => pharmacist.username));
  
      setSuggestedPharmacistUsernames(data.map((pharmacist) => pharmacist.username));
      setShowPharmacistDropdown(true);
      setSearchTermPharmacist("");
      setPharmacists(data);
    } catch (error) {
      setSubmissionviewPharmacists("error");
      setMessage("Failed to fetch pharmacists");
      console.error(error);
    }
  };
  

  const debouncedSearchPharmacistByUsername = debounce(viewPharmacists, 1000);
  useEffect(() => {
    debouncedSearchPharmacistByUsername();
    return () => debouncedSearchPharmacistByUsername.cancel();
  }, [searchTermPharmacist, debouncedSearchPharmacistByUsername]);

  const handlePharmacistInputChange = (e) => {
    setSubmissionviewPharmacists(null);
    setMessage("");
    setSearchTermPharmacist(e.target.value);
  
    if (e.target.value.trim() !== "") {
      setShowPharmacistDropdown(true);
      debouncedSearchPharmacistByUsername();
    } else {
      setShowPharmacistDropdown(false);
      setPharmacists([]);
    }
  };

const handlePharmacistDropdownSelection = (username) => {
  setSearchTermPharmacist(username);
  viewPharmacists();
};
  

const viewPatients = async () => {
  try {
    if (!searchTermPatient.trim()) {
      return;
    }
    const response = await fetch(`/api/administrator/viewPatientInformation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientUsername: searchTermPatient }),
    });

    if (!response.ok) {
      setSubmissionStatusViewPatient("error");
      setMessage("Failed to fetch patients");
      throw new Error("Failed to fetch patients");
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data || data.length === 0) {
      setSubmissionStatusViewPatient("error");
      setMessage(`No patient found with the username "${searchTermPatient}".`);
      setPatients([]);

      return;
    }

    // Make sure you are handling the data correctly
    console.log("Processed Data:", data.map((patient) => patient.username));

    setSuggestedPatientUsernames(data.map((patient) => patient.username));
    setShowPatientDropdown(true);
    setSearchTermPatient("");
    setPatients(data);
  } catch (error) {
    setSubmissionStatusViewPatient("error");
    setMessage(`No patient found with the username "${searchTermPatient}".`);
    console.error(error);
  }
};

  const debouncedSearchPatient = debounce(viewPatients, 1000);
  useEffect(() => {
    debouncedSearchPatient ();
    return () => debouncedSearchPatient .cancel();
  }, [searchTermPatient, debouncedSearchPatient ]);

  const handlePatientInputChange = (e) => {
    setSubmissionStatusViewPatient(null);
    setMessage("");
    setSearchTermPatient(e.target.value);
  
    if (e.target.value.trim() !== "") {
      setShowPatientDropdown(true);
      debouncedSearchPatient ();
    } else {
      setShowPatientDropdown(false);
      setPatients([]);
    }
  };

const handlePatientDropdownSelection = (username) => {
  setSearchTermPatient(username);
  viewPatients();
};

  const toggleViewPatients = () => {
    if (!showPatientDetails) {
      viewPatients();
    } else {
      setShowPatientDetails(false);
    }
  };

  const addAdministrator = async () => {
    if (!adminUsername && !password && !email) {
      setSubmissionStatusAdmin("error");
      setMessage("Please fill in all required fields.");
      return;
    } else if (!adminUsername) {
      setSubmissionStatusAdmin("error");
      setMessage("Please fill the admin username field.");
      return;
    } else if (!password) {
      setSubmissionStatusAdmin("error");
      setMessage("Please fill the password field.");
      return;
    } else if (!email) {
      setSubmissionStatusAdmin("error");
      setMessage("Please fill the email field.");
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
        setSubmissionStatusAdmin("error");
        setMessage("Failed to add administrator");
        throw new Error("Failed to add administrator");
      }
      //const data = await response.json();
      setSubmissionStatusAdmin("success");
      setMessage("Administrator added successfully");
      console.log("Administrator added successfully");
      setAdminUsername("");
      setPassword("");
      setAdminEmail("");
    } catch (error) {
      setSubmissionStatusAdmin("error");
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
        //setSubmissionStatusRequest("error");
        //setMessage("There are no pharmacist requests");
      } else {
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
  const togglePharmacistRequests = async () => {
    try {
      if (!showPharmacistRequests) {
        // Fetch or perform any necessary action to get newPharmacistRequestData
        await viewNewPharmacistRequests();
      }
      setshowPharmacistRequests(!showPharmacistRequests);
    } catch (error) {
      // Handle error, show an alert, or update submissionStatusRequest as needed
      console.error("Error fetching pharmacist requests:", error);
      setSubmissionStatusRequest("error");
      setMessage("Failed to fetch pharmacist requests");
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

  const togglePasswordPopup = () => {
    setShowPasswordPopup(!showPasswordPopup);
  };


  return (
    <div>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "white" }}
      >
        <img src={Image} width="60" />
        <Link to="" className="logo-name">
          <span>El7a2ni</span>
        </Link>
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
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === "home" ? "active" : ""}`}>
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
            </li>
            <li
              className={`nav-btn nav-item ${
                activeTab === "medicines" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("medicines")}
              >
                Medicines
              </button>
            </li>
            <li
              className={`nav-btn nav-item ${
                activeTab === "administrators" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("administrators")}
              >
                Administrators
              </button>
            </li>
            <li
              className={`nav-btn nav-item ${
                activeTab === "reports" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("reports")}
              >
                Sales
              </button>
            </li>
            <li
              className={`nav-btn nav-item ${
                activeTab === "usermanager" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("usermanager")}
              >
                User Manager
              </button>
            </li>
            <li
              className={`nav-btn nav-item ${
                activeTab === "settings" ? "active" : ""
              }`}
            >
              <button
                className="nav-btn nav-link"
                onClick={() => handleTabClick("settings")}
              >
                Settings
              </button>
            </li>
            <li>
              <button className="nav-btn nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="background-cover">
        <div className="container mt-4">
          {activeTab === "settings" && (
            <div className="card mt-4">
              <AdminProfile />
              {/* <button
                className="btn btn-primary mt-2 d-inline-block w-auto"
                onClick={togglePasswordPopup}
              >
                {showPasswordPopup ? "Hide" : "Change Password"}
              </button>
              {showPasswordPopup && (
                <div className="popup">
                  <ChangePassword userType="administrator" />
                </div>
              )}{" "} */}
            </div>
          )}
          {submissionStatus === "success" && (
            <div className="alert alert-success">{message}</div>
          )}
          {submissionStatus === "error" && (
            <div className="alert alert-danger">{message}</div>
          )}
          <br />

          <div className="d-flex align-items-start justify-content-start">
  {activeTab === "administrators" && (
    <>
      {/* Slides on the left */}
            <Carousel style={{ width: '40%' }}>
              <Carousel.Item>
                <img src={slideAdmin} alt="First Slide" className="d-block w-100" />
                <Carousel.Caption>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img src={addAdmin} alt="Second Slide" className="d-block w-100" />
                <Carousel.Caption>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>

      {/* Card on the right */}
      <Card className="mb-3" border="dark" style={{ width: '50%', marginLeft: '20px', marginTop: '55px', borderWidth: '2px' }}>
        <Card.Header className="text-center" style={{ background: '#44bab1', fontWeight: 'bold', color: 'black', fontSize: '22px' }}>Add Administrator</Card.Header>
        <Card.Body>
          {submissionStatusAdmin === "error" && (
            <div className="alert alert-danger">{message}</div>
          )}
          {submissionStatusAdmin === "success" && (
            <div className="alert alert-success">{message}</div>
          )}
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
        </Card.Body>
      </Card>
    </>
  )}
</div>


          <Row>
          {activeTab === "usermanager" && (
          <Col md={6}>
        <Card className="mb-3" border="success" style={{ width:'100%',  marginBottom: '35px', borderWidth: '2px' }}>
        <Card.Body>
          <Card.Title className="text-center" style={{ background: '#44bab1', fontWeight: 'bold', color: 'black' }}>Search for Pharmacist</Card.Title>
          <Card.Img src={pharmacist} alt="Image description" style={{ width: '105px', height: '105px', marginLeft: '220px' }} />
          {submissionStatusviewPharmacists === "error" && searchTermPharmacist.trim() !== "" && (
            <div className="alert alert-danger">{message}</div>
          )}
  
          <div style={{ position: "relative" }} onClick={() => setShowPharmacistDropdown(!showPharmacistDropdown)}>
          <div className="custom-search-input" >
            <i className="la la-search"></i>
            <input
              type="text"
              placeholder="Pharmacist Username"
              value={searchTermPharmacist}
              onChange={handlePharmacistInputChange}
              className="form-control d-inline w-50 search-input w-100"
              style={{ border: 'none', outline: 'none' }} // Remove default input border and outline
            />
          </div>

            {suggestedPharmacistUsernames.length > 0 && showPharmacistDropdown && (
              <ul className="list-group position-absolute w-50 mt-1">
                {suggestedPharmacistUsernames.map((username, index) => (
                  <li
                    key={index}
                    className="list-group-item clickable"
                    onClick={() => handlePharmacistDropdownSelection(username)}
                  >
                    {username}
                  </li>
                ))}
              </ul>
            )}
  
            {submissionStatusviewPharmacists === "error" && !suggestedPharmacistUsernames.length && (
              <div className="alert alert-danger mt-2">Not a valid pharmacist username.</div>
            )}
          </div>
  
          {pharmacists.length > 0 && (
            <div>
              <h4>Search Results</h4>
              <ul>
                {pharmacists.map((result) => (
                  <li key={result.id}>
                    <p>ID: {result._id}</p>
                    <p>Name: {result.name}</p>
                    <p>Email: {result.email}</p>
                    <p>Date of Birth: {new Date(result.dateOfBirth).toLocaleDateString()}</p>
                    <p>Affiliation: {result.affiliation}</p>
                    <p>Educational Background: {result.educationalBackground}</p>
                    <p>Hourly Rate: {result.hourlyRate}</p>
                    <p>Status: {result.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card.Body>
      </Card>
      </Col>
    )}
     
        {activeTab === "usermanager" && (
          <Col md={6}>
          <Card className="mb-3" border="success" style={{ width:'100%',  marginBottom: '185px', borderWidth: '2px' ,marginRight:'155px'}}>
              <Card.Body>
                <Card.Title className="text-center" style={{ background: '#44bab1', fontWeight: 'bold', color: 'black' }}>Search for Patient</Card.Title>
                <Card.Img src={patient} alt="Image description" style={{ width: '105px', height: '105px', marginLeft: '240px' }} />
                {SubmissionStatusViewPatient === "error" && searchTermPatient.trim() !== "" && (
                  <div className="alert alert-danger">{message}</div>
                )}
                <div style={{ position: "relative" }} onClick={() => setShowPatientDropdown(!showPatientDropdown)}>
                  <div className="custom-search-input">
                    <i className="la la-search"></i>
                    <input
                      type="text"
                      placeholder="Patient Username"
                      value={searchTermPatient}
                      onChange={handlePatientInputChange}
                      className="form-control d-inline w-50 search-input w-100"
                    />
                  </div>
                  {suggestedPatientUsernames.length > 0 && showPatientDropdown && (
                    <ul className="list-group position-absolute w-50 mt-1">
                      {suggestedPatientUsernames.map((username, index) => (
                        <li
                          key={index}
                          className="list-group-item clickable"
                          onClick={() => handlePatientDropdownSelection(username)}
                        >
                          {username}
                        </li>
                      ))}
                    </ul>
                  )}
                  {SubmissionStatusViewPatient === "error" && !suggestedPatientUsernames.length && (
                    <div className="alert alert-danger mt-2">Not a valid patient username.</div>
                  )}
                </div>

                {patients.length > 0 && (
                  <div>
                    <h4>Search Results</h4>
                    <ul>
                      {patients.map((result) => (
                        <li key={result.id}>
                          <p>ID: {result._id}</p>
                          <p>Name: {result.name}</p>
                          <p>Email: {result.email}</p>
                          <p>Date of Birth: {new Date(result.dateOfBirth).toLocaleDateString()}</p>
                          <p>Gender: {result.gender}</p>
                          <p>Mobile Phone: {result.mobile_number}</p>
                          <p>
                            Emergency Contact First Name: {result.emergency_contact.firstName}
                          </p>
                          <p>
                            Emergency Contact Middle Name: {result.emergency_contact.middleName}
                          </p>
                          <p>
                            Emergency Contact Last Name: {result.emergency_contact.lastName}
                          </p>
                          <p>
                            Emergency Contact Mobile Phone: {result.emergency_contact.mobile_number}
                          </p>
                          <p>
                            Emergency Contact Relation: {result.emergency_contact.relation}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
            </Col>
        )}
</Row>

          
          {activeTab === "home" && (
          <div >
            <UserCardsTotal /> 
          </div>
        )}
          {activeTab === "home" && (
          <div style={{ width: "35%" , float:"left"}}>
            <UserPieChart /> 
          </div>
        )}
         {activeTab === "home" && (
          <div style={{ width: "60%" ,paddingLeft:"5%" , float:"left"  }}>
            <ProfitBarChart />
          </div>
        )}
         {activeTab === "usermanager" && (
  <div className="mt-4">
    <div className="d-flex flex-column align-items-center">
       <Card className="mt-4"  border="success" style={{ width:'70%', borderWidth: '2px'}}>
      <Card.Body>
        <Card.Title  className="text-center" style={{ background: '#44bab1', fontWeight: 'bold', color: 'black' }}>Pharmacist/Patient to remove</Card.Title>
        <Card.Img src={remove} alt="Image description" style={{ width: '105px', height: '105px', marginLeft: '350px' }} />
        {submissionStatusRemove === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
        {submissionStatusRemove === "success" && (
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
      </Card.Body>
    </Card>

      <div className="mt-4" style={{ fontWeight: 'bold', color: 'black', fontSize: '20px' }}>
        New Pharmacist Requests
      </div>
      {submissionStatusRequest === "error" && (
        <div className="alert alert-danger">{message}</div>
      )}

      <div className="mt-2">
        <button
          className="btn btn-primary"
          onClick={togglePharmacistRequests}
        >
          {showPharmacistRequests
            ? "Hide New Pharmacist Requests"
            : "View New Pharmacist Requests"}
        </button>
      </div>

      {showPharmacistRequests && (
        <div className="mt-2">
          {newPharmacistRequestData.length > 0 ? (
            <Table striped bordered hover style={{ width: '70%' }}>
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
                    {newPharmacistRequestData.map((request) => (
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
                            <div className="d-flex">
                              <button
                                className="btn btn-primary mr-2"
                                onClick={() =>
                                  approvePharmacistRequest(request.username)
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                style={{ marginLeft: '6px' }}
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
                    ))}
                  </tbody>
                </Table>
          ) : (
            <Card style={{ backgroundColor: 'rgb(26, 188, 188)', color: 'black', width: '18rem' }} className="mb-2">
              <Card.Header>No Pharmacist Requests</Card.Header>
              <Card.Body>
                <Card.Title>No new pharmacist requests available.</Card.Title>
                <Card.Text>
                  Explore and check back later for new requests.
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </div>
  </div>
)}

          {activeTab === "medicines" && (
            <div className="mt-4">{<Medicine modelName="administrator" />}</div>
          )}
          
          {activeTab === "reports" && (
            <div className="report" style={{ textAlign: 'center', marginBottom: '60px', fontSize: '20px', fontFamily: 'inherit' }}>
              <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', display: 'inline-block', width: '100%' }}>Sales Report</h2>
            </div>
          )}

          {activeTab === "reports" && (
          <div style={{ width: "55%" ,paddingLeft:"5%" , float:"left"  }}>
            <MedicinePrescriptionChart />
          </div>
        )}
        {activeTab === "reports" && (
          <div className="sales-container">
             <SalesReportGenerator userType="administrator" />
          </div>
        )}
          
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Administrator;
