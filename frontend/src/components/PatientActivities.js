import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Patientctivities({ modelName }) {
   
  return (
    <div>
 
<button onClick={() => window.location.href=`/api/${modelName}/addNewDeliveryAddress?patientUsername=myy`}>Add A new Address</button>
<button onClick={() => window.location.href=`/api/${modelName}/checkOutmyOrder?patientUsername=myy`}>CheckOut My Order</button>

    </div>
  );
}

export default Patientctivities;
