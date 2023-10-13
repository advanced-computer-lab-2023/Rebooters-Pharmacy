import React, { useState, useEffect } from "react";
import Medicine from "../components/Medicine";
import "bootstrap/dist/css/bootstrap.min.css";

function Administrator() {
  //const [administrators, setAdministrators] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pharmacistUsername, setPharmacistUsername] = useState("");
  const [patientUsername, setPatientUsername] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userToRemove, setUserToRemove] = useState("");
  const [newPharmacistRequestData, setNewPharmacistRequestData] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null); 
  const [message, setMessage] = useState("");

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

  const viewPharmacists = async () => {
    if (
      !pharmacistUsername 
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
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
        setSubmissionStatus("error");
        setMessage("Failed to fetch pharmacists");
        throw new Error("Failed to fetch pharmacists");
      }
      const data = await response.json();
      if(!data){
        setSubmissionStatus("error");
        setMessage("Pharmacist not found");
      }
      setPharmacists(data);
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("Failed to fetch pharmacists");
      console.error(error);
    }
  };

  const viewPatients = async () => {
    if (
      !patientUsername 
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
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
        setSubmissionStatus("error");
        setMessage("Failed to fetch patients");
        throw new Error("Failed to fetch patients");
      }
      if(!data){
        setSubmissionStatus("error");
        setMessage("Patient not found");
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("Failed to fetch patients");
      console.error(error);
    }
  };

  const addAdministrator = async () => {
    if (
      !adminUsername ||
      !password
    ) {
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
        body: JSON.stringify({ username: adminUsername, password }),
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
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("Failed to add administrator");
      console.error(error);
    }
  };

  const removeUserFromSystem = async () => {
    if (
      !userToRemove
    ) {
      setSubmissionStatus("error");
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
        setSubmissionStatus("error");
        setMessage("Failed to remove pharmacist/patient");
        throw new Error("Failed to remove pharmacist/patient");
      }
      console.log("Pharmacist/patient removed successfully");
      setUserToRemove("");
      setSubmissionStatus("success");
      setMessage("Pharmacist/patient removed successfully");
    } catch (error) {
      console.error(error);
      setSubmissionStatus("error");
      setMessage("Failed to remove pharmacist/patient");
    }
  };

  const viewNewPharmacistRequests = async () => {
    try {
      const response = await fetch(
        `/api/administrator/viewPharmacistApplication`
      );
      if (!response.ok) {
        setSubmissionStatus("error");
        setMessage("Failed to fetch new pharmacist requests");
        throw new Error("Failed to fetch new pharmacist requests");
      }
      const data = await response.json();
      if(data.length ==0){
        setSubmissionStatus("error");
        setMessage("There are no pharmacist requests");
      }
      setNewPharmacistRequestData(data);
    } catch (error) {
      setSubmissionStatus("error");
      setMessage("Failed to fetch new pharmacist requests");
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Administrator Dashboard</h1>
      {submissionStatus === "success" && (
          <div className="alert alert-success">{message}</div>
        )}
        {submissionStatus === "error" && (
          <div className="alert alert-danger">{message}</div>
        )}
      <div className="mb-3">
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
        <button className="btn btn-primary" onClick={addAdministrator}>
          Add Administrator
        </button>
      </div>
      <div className="mb-3">
        <h2>Search for Pharmacist</h2>
        <input
          type="text"
          placeholder="Pharmacist Username"
          value={pharmacistUsername}
          onChange={(e) => setPharmacistUsername(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={viewPharmacists}>
          Search Pharmacist
        </button>
      </div>
      <div>
        {pharmacists.length > 0 && (
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
                  <p>Educational Background: {result.educationalBackground}</p>
                  <p>Hourly Rate: {result.hourlyRate}</p>
                  <p>Status: {result.status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mb-3">
        <h2>Search for Patient</h2>
        <input
          type="text"
          placeholder="Patient Username"
          value={patientUsername}
          onChange={(e) => setPatientUsername(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={viewPatients}>
          Search Patient
        </button>
      </div>
      <div>
        {patients.length > 0 && (
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
                  <p>Emergency Contact First Name: {result.emergency_contact.firstName}</p>
                  <p>Emergency Contact Middle Name: {result.emergency_contact.middleName}</p>
                  <p>Emergency Contact Last Name: {result.emergency_contact.lastName}</p>
                  <p>Emergency Contact Mobile Phone: {result.emergency_contact.mobile_number}</p>
                  <p>Emergency Contact Relation: {result.emergency_contact.relation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2>Pharmacist/Patient to remove</h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Username to Remove"
            value={userToRemove}
            onChange={(e) => setUserToRemove(e.target.value)}
            className="form-control"
          />
          <button
            className="btn btn-danger mt-2"
            onClick={removeUserFromSystem}
          >
            Remove Pharmacist/Patient
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h2>New Pharmacist Requests</h2>
        <button className="btn btn-primary" onClick={viewNewPharmacistRequests}>
          View New Pharmacist Requests
        </button>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Hourly Rate</th>
              <th>Speciality</th>
              <th>Affiliation</th>
              <th>Educational Background</th>
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
                <td>{request.speciality}</td>
                <td>{request.affiliation}</td>
                <td>{request.educationalBackground}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        {<Medicine modelName="pharmacist"/>}
        </div>
    </div>
  );
}

export default Administrator;
