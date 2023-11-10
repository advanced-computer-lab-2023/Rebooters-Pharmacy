//import React from 'react';
import Medicine from "../components/Medicine";
import PatientActivities from "../components/PatientActivities";
import ViewCartItems from "../components/ViewCartItems";
import RemoveCartItem from "../components/RemoveCartItem";
import CancelOrder from "../components/CancelOrder";
import CheckingOut from "../components/CheckingOut";

const Patient = () => {
  return (
    <div>
      <div className="mt-4">
      <h1 className="mb-4 text-center">Patient Dashboard</h1>
      {<Medicine modelName="patient"/>}
      
      {<PatientActivities modelName="patient"/>}
      {<CheckingOut modelName="patient"/>}
      </div>
      <div className="mt-4">
          <ViewCartItems />
        </div>

      <div className="mt-4">
          <RemoveCartItem />
        </div>

      <div className="mt-4">
          <CancelOrder />
        </div>
    </div>
  );
};

export default Patient;
