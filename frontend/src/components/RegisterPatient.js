import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddPatient = () => {
  const [newPatient, setNewPatient] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    mobile_number: "",
    emergency_contact: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobile_number: "",
      relation: "",
    },
  });
  const [submissionStatus, setSubmissionStatus] = useState(null); 
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the input name contains a dot, it's a nested field within emergency_contact
    if (name.includes("emergency_contact.")) {
      const nestedField = name.split(".")[1];
      setNewPatient({
        ...newPatient,
        emergency_contact: {
          ...newPatient.emergency_contact,
          [nestedField]: value,
        },
      });
    } else {
      setNewPatient({
        ...newPatient,
        [name]: value,
      });
    }
  };

  const handleAddPatient = async () => {
    if (
      !newPatient.username ||
      !newPatient.name ||
      !newPatient.email ||
      !newPatient.password ||
      !newPatient.dateOfBirth ||
      !newPatient.gender ||
      !newPatient.mobile_number ||
      !newPatient.emergency_contact.firstName ||
      !newPatient.emergency_contact.lastName ||
      !newPatient.emergency_contact.mobile_number ||
      !newPatient.emergency_contact.relation
    ) {
      setSubmissionStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch("/api/guest/createPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        console.log("Patient added successfully!");
        setNewPatient({
          username: "",
          name: "",
          email: "",
          password: "",
          dateOfBirth: "",
          gender: "",
          mobile_number: "",
          emergency_contact: {
            firstName: "",
            middleName: "",
            lastName: "",
            mobile_number: "",
            relation: "",
          },
        });
        setSubmissionStatus("success");
        setMessage("Patient added successfully!");
      } else {
        console.error("Error adding patient to the database.");
        setSubmissionStatus("error");
        setMessage("Error adding patient to the database.");
      }
    } catch (error) {
      console.error("An error occurred while adding the patient:", error);
      setSubmissionStatus("error");
      setMessage("An error occurred while adding the patient: " + error.message);
    }
  };

  return (
    <div className="card container mt-4">
      <div className="card-body">
        <h2>Register as a Patient</h2>
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
            value={newPatient.username}
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
            value={newPatient.name}
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
            value={newPatient.email}
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
            value={newPatient.password}
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
            value={newPatient.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Gender:
          </label>
          <select
            className="form-select"
            id="gender"
            name="gender"
            value={newPatient.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number:
          </label>
          <input
            type="tel"
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            value={newPatient.mobile_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.firstName" className="form-label">
            Emergency Contact First Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="emergency_contact.firstName"
            name="emergency_contact.firstName"
            value={newPatient.emergency_contact.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.middleName" className="form-label">
            Emergency Contact Middle Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="emergency_contact.middleName"
            name="emergency_contact.middleName"
            value={newPatient.emergency_contact.middleName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.lastName" className="form-label">
            Emergency Contact Last Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="emergency_contact.lastName"
            name="emergency_contact.lastName"
            value={newPatient.emergency_contact.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.mobile_number" className="form-label">
            Emergency Contact Mobile Number:
          </label>
          <input
            type="tel"
            className="form-control"
            id="emergency_contact.mobile_number"
            name="emergency_contact.mobile_number"
            value={newPatient.emergency_contact.mobile_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emergency_contact.relation" className="form-label">
            Emergency Contact Relation to Patient:
          </label>
          <input
            type="text"
            className="form-control"
            id="emergency_contact.relation"
            name="emergency_contact.relation"
            value={newPatient.emergency_contact.relation}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddPatient}>
          Register to be a Patient
        </button>
      </div>
    </div>
  );
};

export default AddPatient;
