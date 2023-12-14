import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/viewCancelOrder.css';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Card from 'react-bootstrap/Card';

const ViewAndCancelOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // Fetch orders for the current patient
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/patient/viewAllOrders'); // Replace with your API endpoint
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/patient/cancelOrder`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Canceled" } : order
          )
        );
      } else {
        // Handle error from the server
        console.error('Error canceling order');
      }
    } catch (error) {
      console.error("Error canceling order", error);
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/patient/viewOrderDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
        setSelectedOrderId(orderId);
        toggleDetails();
      } else {
        console.error("Error fetching order details");
      }
    } catch (error) {
      console.error("Error fetching order details", error);
    }
  };

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  const CloseButton = () => (
    <Button variant="secondary" onClick={toggleDetails}>
      Close
    </Button>
  );

  return (
    <div className="container mt-5">
      <h2>Your Orders</h2>

      {orders.length > 0 ? ( // Conditionally render either the table or the card
        <table className="table table-bordered table-striped">
          <thead className="thead-primary">
            <tr className="table-primary">
              <th>Order ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className={order.status === 'Pending' ? '' : ''}>
                <td>{order._id}</td>
                <td>
                  {order.status === 'Pending' && (
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: '50%' }}
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        In Progress
                      </div>
                    </div>
                  )}
                  {order.status !== 'Pending' && <span>{order.status}</span>}
                </td>
                <td>
                  <Offcanvas
                    show={isDetailsVisible && selectedOrderId === order._id}
                    onHide={toggleDetails}
                    placement="end"
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>Order Details</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      {orderDetails && (
                        <div>
                          <p>Order ID: {selectedOrderId}</p>
                          <p>Status: {orderDetails.status}</p>
                          <p>
                            Order Date:{' '}
                            {new Date(orderDetails.orderDate).toLocaleString()}
                          </p>
                          <p>Payment Method: {orderDetails.paymentMethod}</p>
                          <p>Total: ${orderDetails.total}</p>

                          <h4>Items:</h4>
                          <ul>
                            {orderDetails.items.map((item, index) => (
                              <li key={index}>
                                <p>Name: {item.name}</p>
                                <p>Price: ${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                {item.image && (
                                  <img
                                    src={`${item.image.filename}`}
                                    alt={item.name}
                                    className="bd-placeholder-img card-img-top"
                                    style={{ width: "20%", height: "25" }}
                                  />
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <CloseButton />
                    </Offcanvas.Body>
                  </Offcanvas>
                  <Button
                    variant="primary"
                    className="ml-2"
                    style={{ marginRight: "5px" }}
                    onClick={() => handleViewOrderDetails(order._id)}
                  >
                    View Details
                  </Button>
                  {order.status === 'Pending' && (
                    <button
                      className="btn btn-secondary"
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
      ) : (
        <div>
           <Card style={{ backgroundColor: 'rgb(26, 188, 188)', color: 'black', width: '18rem' }} className="mb-2">
            <Card.Header>No Orders</Card.Header>
            <Card.Body>
              <Card.Title>No past orders and no pending orders.</Card.Title>
              <Card.Text>
                You can start exploring and place orders.
              </Card.Text>
            </Card.Body>
          </Card>
          <Link to="/patient#medicines" className="btn btn-outline-primary btn-md btn-block" >
            Start Shopping
          </Link>

        </div>
      )}
    </div>
  );
};

export default ViewAndCancelOrder;
