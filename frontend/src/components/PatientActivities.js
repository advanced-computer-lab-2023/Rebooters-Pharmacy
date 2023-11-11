import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Patientctivities({ modelName }) {
  const [counter, setCounter] = React.useState(2);
  function addInputField() {
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter address...";
    input.id=`ad${counter}`;
    setCounter(counter+1);

    var div = document.createElement("div");
    div.appendChild(input);

    document.getElementById("inputContainer").appendChild(div);
}
  const addAddress = async () => {
    try {
      let deliveryAddress = document.getElementById("ad1").value + "%";
      for (let i = 2; i < counter; i++) {
        deliveryAddress += document.getElementById(`ad${i}`).value + "%";
      }
      const response = await fetch(`/api/patient/addNewDeliveryAddress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryAddress }),
      });
      alert("address added");
      if (!response.ok) {
        throw new Error("Failed to add address");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container card">
      <h3>Add Address </h3>
      <div id="inputContainer">
      <div><input type="text" className="form-control col-md-8" id="ad1" placeholder="Enter Your Full Address" />
        <button onClick={addInputField}>+</button></div>
        <br></br>
      </div>
      <div><button className="btn btn-primary" onClick={addAddress}>Add</button></div>
    </div>
  );
}

export default Patientctivities;
