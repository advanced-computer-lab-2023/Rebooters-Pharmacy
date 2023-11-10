import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const CancelOrder = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders for the current patient
  useEffect(() => {
    // Fetch orders based on the logged-in user or patient information
    // You may need to implement this part according to your authentication and data fetching logic
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/patient/viewOrderDetails'); // Replace with your API endpoint
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
    };

    fetchOrders();
  }, []); // Run the effect only once on component mount

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/patient/cancelOrder`, {
        method: 'POST', 
      });

      if (response.ok) {
        // Order was successfully canceled
        // Update the order status in the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: 'Canceled' } : order
          )
        );
      } else {
        // Handle error from the server
        console.error('Error canceling order');
      }
    } catch (error) {
      console.error('Error canceling order', error);
    }
  };

  return (
    <div>
      <h2>Your Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.status}</td>
              <td>
                {order.status === 'Pending' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancelOrder;
