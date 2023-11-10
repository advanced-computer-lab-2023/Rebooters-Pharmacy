import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CheckingOut({ modelName }) {

    const [elementsArray,setelementsArray] = React.useState([]);
    const [cartItems,setCartItems] = React.useState([]);
    const [subTotal, setsubTotal] = useState(() => {
        const storedValue = localStorage.getItem("subTotal");
        return storedValue !== null ? storedValue : 0;
    });

    useEffect(()=>{  
             fetch(`/api/patient/viewDeliveryAddresses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            }) .then(res=>(res.json()))
            .then(data=>setelementsArray(data))
             .catch(err=>console.log(err))
             fetch(`/api/patient/viewCartItems`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({}),
                }) .then(res=>(res.json()))
                .then(data=>setCartItems(data))
                 .catch(err=>console.log(err))

                 const newValue = calculateNewValue();
            
              setsubTotal(newValue)
              localStorage.setItem("subTotal", newValue);
              
        },[cartItems,setelementsArray])
        const calculateNewValue = () => {
            let sum=0;
            for(let i=0;i<cartItems.length;i++){
                sum+=cartItems[i].price*cartItems[i].quantity
             
            }            
            return sum;
        };
     const checkout= async () => {
        try {
          let patientMobileNumber=document.getElementById('phone').value;
          let address=document.getElementById('dropdown').value;
          let paymentMethod=document.getElementById('paymentMethod').value;
         
             const response = await fetch(`/api/patient/checkout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ total:subTotal,address,patientMobileNumber,paymentMethod, items:cartItems}),
            });
            if (!response.ok) {       
              throw new Error("Failed to add order");
            }
           alert('order added successfully')
          } catch (error) {
            console.error(error);
          }
    }
    //here the user can update the quantity when checking out lessa f cart
   
    return (
    
        <div>
            <p>Order CheckOut </p>
            <label htmlFor="dropdown">Choose a shipping address:</label>
            <select id="dropdown" >

                {Array.isArray(elementsArray) && elementsArray.map((element, index) => (
                    <option key={index} value={element}>
                        {element}
                    </option>
                ))}

  
            </select>
            
            <p>Order Details:</p>
            {
             Array.isArray(cartItems)&& cartItems.map(obj=><p key={obj._id} >  
           
             name: {obj.name}<br></br>
              price: {obj.price}<br></br>
               quantity: {obj.quantity}
               </p>
              

               )
            }  
              <p>SubTotal Is :{subTotal}</p>
            <label htmlFor="paymentMethod">Choose a Payment Method:</label>
            <select id="paymentMethod" >

            <option value="wallet">wallet</option>
           <option value="credit card (using Stripe)">credit card (using Stripe)</option>
           <option value="cash on delivery">cash on delivery</option>        
            </select>
            <br></br>
            <p>Contact Me  <input id="phone" type="text" placeholder="phone number"></input></p>
            <br></br>
<button onClick={checkout}>Check Out</button>
        </div>
    );
}

export default CheckingOut;
