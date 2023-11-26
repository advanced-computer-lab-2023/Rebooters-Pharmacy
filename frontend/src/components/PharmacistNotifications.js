import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [outOfStockMedicines, setOutOfStockMedicines] = useState([]);

  useEffect(() => {
    const fetchOutOfStockMedicines = async () => {
      try {
        const response = await fetch("/api/pharmacist/getOutOfStockMedicines");
        if (response.ok) {
          const data = await response.json();
          setOutOfStockMedicines(data.outOfStockMedicines);
        } else {
          console.error("Failed to fetch out of stock medicines");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchOutOfStockMedicines();
  }, []);

  return (
    <div className="card">
      <h2 className="card-header">Notifications</h2>
      <div className="card-body">
        {outOfStockMedicines.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {outOfStockMedicines.map((medicine, index) => (
              <li key={index}>{`${medicine} is out of stock`}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
