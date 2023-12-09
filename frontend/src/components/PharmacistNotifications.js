import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [outOfStockMedicines, setOutOfStockMedicines] = useState([]);

  useEffect(() => {
    const fetchOutOfStockMedicines = async () => {
      try {
        const response = await fetch("/api/pharmacist/getOutOfStockMedicines");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched out of stock medicines:", data.outOfStockMedicines);
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

  const removeNotification = async (index, medicineName) => {
    try {
      // Make a request to your server to remove the notification from the database
      const response = await fetch("/api/pharmacist/removeOutOfStockMedicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicineName }),
      });

      if (response.ok) {
        // If the server successfully removes the notification, update the state
        const updatedNotifications = [...outOfStockMedicines];
        updatedNotifications.splice(index, 1);
        setOutOfStockMedicines(updatedNotifications);
      } else {
        console.error("Failed to remove notification from the server");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="card">
      <h2 className="card-header">Notifications</h2>
      <div className="card-body">
        {outOfStockMedicines.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {outOfStockMedicines.map((medicine, index) => (
              <li key={index}>
                {`${medicine} is out of stock`}
                <button
                  className="btn btn-sm btn-danger ml-2"
                  onClick={() => removeNotification(index, medicine)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
