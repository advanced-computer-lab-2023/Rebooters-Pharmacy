import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Form, Row, Col, Button } from "react-bootstrap";
import PatientAddAddress from "./PatientAddAddress";

function CheckingOut({ modelName ,sharedState, setSharedState }) {
  const [elementsArray, setelementsArray] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [subTotal, setsubTotal] = useState(() => {
    const storedValue = localStorage.getItem("subTotal");
    return storedValue !== null ? storedValue : 0;
  });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleChange = (event) => {
    // Update the shared state when the input changes
    setSharedState(cartItems);
  };

  useEffect(() => {
    fetch(`/api/patient/viewDeliveryAddresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => setelementsArray(data))
      .catch((err) => console.log(err));
    fetch(`/api/patient/viewCartItems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.log(err));

    const newValue = calculateNewValue();

    setsubTotal(newValue);
    localStorage.setItem("subTotal", newValue);
  }, [cartItems, setelementsArray]);

  const calculateNewValue = () => {
    let sum = 0;
    for (let i = 0; i < cartItems.length; i++) {
      sum += cartItems[i].price * cartItems[i].quantity;
    }
    return sum;
  };


  const addNewAddress = async (newAddress) => {
    try {
      // Update the elementsArray with the new address
      setelementsArray((prevAddresses) => [...prevAddresses, newAddress]);
  
      // Save the new address to the server
      const response = await fetch(`/api/patient/addNewDeliveryAddress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryAddress: newAddress }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add address");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const checkout = async () => {
    try {

      let patientMobileNumber = document
        .getElementById("phone")
        .value.toString();
      let address = document.getElementById("dropdown").value;
      let paymentMethod = document.getElementById("paymentMethod").value;

      if (!patientMobileNumber.trim()) {
        setAlert({ message: "Please fill in the mobile number.", type: "danger" });
        return;
      }
      if (cartItems.length === 0) {
        setAlert({ message: "The cart is empty. Add items to the cart before checking out.", type: "danger" });
        return;
      }

      if (!address.trim()) {
        setAlert({
          message: "Please add an address before checking out.",
          type: "danger",
        });
        return;
      }

      const response = await fetch(`/api/patient/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          patientMobileNumber,
          paymentMethod,
          items: cartItems,
        }),
      });

      

      if (!response.ok) {
        const data = await response.json();
        if (data.message === 'Not enough money in the wallet') {
          setAlert({ message: data.message, type: "danger" });
        } else if (data.message.startsWith('Not enough stock for')) {
          // Display a specific message for not enough stock
          setAlert({ message: data.message, type: "danger" });
        }
        return;
      }

      
      setAlert({ message: "Order added!", type: "success" });
    
      if (paymentMethod === "credit card (using Stripe)") {
        try {
          const stripeResponse = await fetch(
            "http://localhost:3000/create-checkout-session",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: [
                  { id: 1, quantity: 3 },
                  { id: 2, quantity: 1 },
                ],
              }),
            }
          );

          if (stripeResponse.ok) {
            const { url } = await stripeResponse.json();
            window.location = url;
            console.log(url);
          } else {
            setAlert({ message: "Network response from Stripe was not ok", type: "warning" });
            throw new Error("Network response from Stripe was not ok");
          }
        } catch (stripeError) {
          console.error("Stripe Error:", stripeError);
        }
      }
      else{
        window.location.reload();
      }
    } catch (error) {
      console.error("Outer Error:", error);
    }
  };

  const handleAlertClose = () => {
    // Close the alert by setting it to null
    setAlert({ message: "", type: "" });
  };



  return (
    <div className="container">

       {/* Bootstrap Alert */}
      {alert.message && (
        <Alert
          variant={alert.type}
          onClose={handleAlertClose}
          dismissible
          className="mt-3"
        >
          {alert.message}
        </Alert>
      )}

      {/* {Array.isArray(cartItems) &&
        cartItems.map((obj, index) => (
          <p key={obj._id}>
            {index + 1}. Name: {obj.name}
            <br />
            Price: {obj.price}
            <br />
            Quantity: {obj.quantity}
          </p>
        ))} */}
         <span>&nbsp;</span>

      <hr />
      <h4>Your shipping information:</h4>

      <Form>
        {/* Render the PatientAddAddress component to allow adding a new address */}
        <PatientAddAddress addNewAddress={addNewAddress} />

      <Form.Group as={Row}>
          <Form.Label column sm="3">
            Choose one of your shipping addresses:
          </Form.Label>
          <Col sm="3">
            <Form.Control
              as="select"
              id="dropdown"
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              {elementsArray.map((element, index) => (
                <option key={index} value={element}>
                  {element}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm="3">
          Choose a Payment Method:
        </Form.Label>
        <Col sm="3">
          <Form.Control as="select" id="paymentMethod">
            <option value="wallet">wallet</option>
            <option value="credit card (using Stripe)">
              credit card (using Stripe)
            </option>
            <option value="cash on delivery">cash on delivery</option>
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm="3">
          Your mobile number:
        </Form.Label>
        <Col sm="3">
          <Form.Control
            type="text"
            id="phone"
            placeholder="Mobile number"
            className="form-control"
          />
        </Col>
      </Form.Group>


        <Button onClick={checkout} className="btn btn-primary">
          Check Out
        </Button>
      </Form>
    </div>
  );
}

export default CheckingOut;
