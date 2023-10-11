import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ViewMedicineQuantitySales({ modelName }) {
  const [medicines, setMedicines] = useState(null);

  const viewMedicineInventoryPharmacist = async () => {
    try {
      const response = await fetch(`/api/pharmacist/viewMedicineInventoryPharmacist`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Data received from API:', data);
      setMedicines(data);
      console.log('Medicines in state:', medicines);
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    viewMedicineInventoryPharmacist();
  }, []); // Load data when the component mounts

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Medicine Quantity and Sales</h1>
      <div>
        <h2>Medicine List</h2>
        <ul className="list-group">
          {medicines&&medicines.map((medicine) => (
            <li className="list-group-item" key={medicine.id}> {/* Added a unique key */}
              <h3>Name: {medicine.name}</h3>
              <p>Quantity: {medicine.quantity}</p>
              <p>Sales: {medicine.sales}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ViewMedicineQuantitySales;
