//import React from 'react';
import Medicine from "../components/Medicine";

const Patient = () => {
  return (
    <div>
      <div className="mt-4">
      <h1 className="mb-4 text-center">Patient Dashboard</h1>
      {<Medicine modelName="patient"/>}
      </div>
    </div>
  );
};

export default Patient;
