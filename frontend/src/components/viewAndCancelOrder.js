import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const ViewAndCancelOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);


  // Fetch orders for the current patient
  useEffect(() => {
    // Fetch orders based on the logged-in user or patient information
    // You may need to implement this part according to your authentication and data fetching logic
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/patient/viewAllOrders'); // Replace with your API endpoint
        const data = await response.json();
        setOrders(data);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
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
  const handleViewOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/patient/viewOrderDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
        setSelectedOrderId(orderId);
        toggleDetails();
      } else {
        console.error('Error fetching order details');
      }
    } catch (error) {
      console.error('Error fetching order details', error);
    }
  };

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
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
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'Pending' && (
                    <>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                     
                    </>
                  )}
                  <button
                        className="btn btn-info ml-2"
                        onClick={() => handleViewOrderDetails(order._id)}
                      >
                        View Details
                      </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {selectedOrderId && orderDetails && isDetailsVisible &&(
        <div>
          <h3>Order Details</h3>
          <p>Order ID: {selectedOrderId}</p>
          <p>Status: {orderDetails.status}</p>
          <p>Order Date: {new Date(orderDetails.orderDate).toLocaleString()}</p>
          <p>Payment Method: {orderDetails.paymentMethod}</p>
          <p>Total: ${orderDetails.total}</p>

          <h4>Items:</h4>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index}>
                <p>Name: {item.name}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewAndCancelOrder;