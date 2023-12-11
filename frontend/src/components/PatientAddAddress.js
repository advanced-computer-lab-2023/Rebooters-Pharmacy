import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from 'react-bootstrap/Alert';


function PatientAddAddress({ addNewAddress }) {
  const [counter,setCounter]=React.useState(2);
  const [successMessage, setSuccessMessage] = useState('');

 // const params = new URLSearchParams(window.location.search);
  //const patientUsername = params.get('patientUsername') //will bet taken from login later ;

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

    // Call the addNewAddress function passed as a prop
    addNewAddress(deliveryAddress);

    //alert("address added");
    setSuccessMessage('Address Added successfull');
        

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
    <div id="inputContainer">
    {successMessage && <Alert variant="success">{successMessage}</Alert>}
   <input
      type="text"
      id="ad1"
     placeholder="enter address..."
    
    />
<button onClick={addInputField}>+</button>
<br></br>
</div>
<button onClick={addAddress}>Add</button>
    </div>

  );
}

export default PatientAddAddress;
