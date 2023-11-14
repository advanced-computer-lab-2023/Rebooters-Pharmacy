import React from 'react';
import PharmacistRegistrationRequest from "../components/PharmacistRequest";
import PatientRegistrationRequest from "../components/RegisterPatient";

const Guest = () => {
  return (
    <div> 
      <h2 className="mb-4 mt-4 text-center">Register as a Patient</h2>
      <div className="mt-4">
        <PatientRegistrationRequest />
      </div>
      <h2 className="mb-4 mt-4 text-center">Request to register as a Pharmacist</h2>
      <div className="mt-4">
        <PharmacistRegistrationRequest />
      </div>
    </div>
  );
};

export default Guest;
