import React, { useEffect, useState } from 'react';
import bell from "../content/images/belll.png";
import "../styles/pharmHome.css";

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
<div className="card position-relative m-3 p-3" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      
      <h2 className="card-header text-center" style={{ background: '#44bab1', margin: '0' }}>
        Notifications
      </h2><img
        src={bell}
        alt="Notification Bell"
        className="position-absolute  end-0 m-3 rounded-circle"
        style={{ width: '60px', height: '56px', cursor: 'pointer', top: '1px' }}
      />
      <div className="card-body">
        {outOfStockMedicines.length === 0 ? (
          <p className="alert alert-danger">No notifications at the moment.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Medicine</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {outOfStockMedicines.map((medicine, index) => (
                <tr key={index} className="notification-item">
                  <td>{`${medicine} is out of stock`}</td>
                  <td>
                    <button
  className="btn btn-sm btn-outline-danger"
  onClick={() => removeNotification(index, medicine)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Notifications;
