import React, { useState, useEffect } from "react";
import AddMedicine from "../components/addMedicine";
import EditMedicine from "../components/editMedicine";
import ViewMedicineQuantitySales from "../components/ViewMedicineQuantitySales";
import "bootstrap/dist/css/bootstrap.min.css";


const PharmacistHome = () => {
    const [pharmacistData, setPharmacistData] = useState(null);
  
    return (
      <div className="container">
        <div className="mt-4">
          <AddMedicine />
        </div>
        <div className="mt-4">
          <EditMedicine />
        </div>
        <div className="mt-4">
          <ViewMedicineQuantitySales />
        </div>
      </div>
      
    );
  };
  
  export default PharmacistHome;
  