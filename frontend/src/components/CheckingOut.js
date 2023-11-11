import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CheckingOut({ modelName }) {
  const [elementsArray, setelementsArray] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [subTotal, setsubTotal] = useState(() => {
    const storedValue = localStorage.getItem("subTotal");
    return storedValue !== null ? storedValue : 0;
  });

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
  const checkout = async () => {
    try {
      let patientMobileNumber = document
        .getElementById("phone")
        .value.toString();
      let address = document.getElementById("dropdown").value;
      let paymentMethod = document.getElementById("paymentMethod").value;

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
        throw new Error("Failed to add order");
      }
      alert("order added");
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
            throw new Error("Network response from Stripe was not ok");
          }
        } catch (stripeError) {
          console.error("Stripe Error:", stripeError);
        }
      }
    } catch (error) {
      console.error("Outer Error:", error);
    }
  };
  return (
    <div className="container">

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
      <h6>Total : {subTotal} $</h6>
      <hr />
      <h4>Your shipping information:</h4>
      <label htmlFor="dropdown">Choose one of your shipping addresses:</label>
      <select id="dropdown">
        {Array.isArray(elementsArray) &&
          elementsArray.map((element, index) => (
            <option key={index} value={element}>
              {element}
            </option>
          ))}
      </select>
      <br/>
      <label htmlFor="paymentMethod">Choose a Payment Method:</label>
      <select id="paymentMethod" >
        <option value="wallet">wallet</option>
        <option value="credit card (using Stripe)">
          credit card (using Stripe)
        </option>
        <option value="cash on delivery">cash on delivery</option>
      </select>
      <br></br>
      <div>
        Your mobile number: {" "}
        <input id="phone" type="text" className="form-control" placeholder="mobile number"></input>
      </div>
      <br></br>
      <button onClick={checkout} className="btn btn-primary">Check Out</button>
    </div>
  );
}

export default CheckingOut;
