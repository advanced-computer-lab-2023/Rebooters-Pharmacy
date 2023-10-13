import React from 'react';
import PharmacistRegistrationRequest from "../components/PharmacistRequest";
import PatientRegistrationRequest from "../components/RegisterPatient";

const Guest = () => {
  return (
    <div> 
      <h1 className="mb-4 text-center">Welcome Guest!</h1>
      <div className="mt-4">
        <PatientRegistrationRequest />
      </div>
      <div className="mt-4">
        <PharmacistRegistrationRequest />
      </div>
    </div>
  );
};

export default Guest;
