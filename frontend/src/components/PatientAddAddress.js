import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from 'react-bootstrap/Alert';


function PatientAddAddress({ addNewAddress }) {
  const [counter,setCounter]=React.useState(2);
  const [successMessage, setSuccessMessage] = useState('');

 // const params = new URLSearchParams(window.location.search);
  //const patientUsername = params.get('patientUsername') //will bet taken from login later ;

  function addInputField(event) {
    event.preventDefault();
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter address...";
    input.id=`ad${counter}`;
    setCounter(counter+1);

    var div = document.createElement("div");
    div.appendChild(input);

    document.getElementById("inputContainer").appendChild(div);
}
const addAddress = async (event) => {
  event.preventDefault();
  try {
    let emptyAddress = false;
    let deliveryAddress = document.getElementById("ad1").value + "%";
    for (let i = 2; i < counter; i++) {
      deliveryAddress += document.getElementById(`ad${i}`).value + "%";
      if (document.getElementById(`ad${i}`).value + "" === "")
        emptyAddress = true;
    }

    // Call the addNewAddress function passed as a prop
    addNewAddress(deliveryAddress);

    //alert("address added");
    if (!emptyAddress)
      setSuccessMessage('Address Added successfully');
    else 
      setSuccessMessage('One (or more) of the addresses were empty.');

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  // Reset successMessage after 2 seconds
  const resetSuccessMessage = () => {
    setSuccessMessage('');
  };

  const timer = setTimeout(resetSuccessMessage, 2000);

  return () => clearTimeout(timer);
}, [successMessage]);

  return (
    <div>
    <div id="inputContainer" style= {{ marginBottom: "5px" }}>
    {successMessage && <Alert variant="success">{successMessage}</Alert>}
   <input
      type="text"
      id="ad1"
     placeholder="enter address..."
    
    />
<button onClick={(e) => addInputField(e)}>+</button>
<br></br>

</div>
<div style={{ marginBottom: "5px" }}>
  <button onClick={(e) => addAddress(e)} className="btn btn-primary">
    Add
  </button>
</div>

    </div>

  );
}

export default PatientAddAddress;
