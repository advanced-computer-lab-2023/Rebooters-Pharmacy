import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CheckingOut({ modelName }) {
    const numbersArray = Array.from({ length: 20 }, (_, i) => i + 1);

    const [elementsArray,setelementsArray] = React.useState([]);
    const [cartItems,setCartItems] = React.useState([]);
    const [subTotal, setsubTotal] = useState(() => {
        const storedValue = localStorage.getItem("subTotal");
        return storedValue !== null ? storedValue : 0;
    });

    useEffect(()=>{  
            //patientUsername to be taken from login
             fetch(`/api/patient/viewDeliveryAddresses?patientUsername=myy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            }) .then(res=>(res.json()))
            .then(data=>setelementsArray(data))
             .catch(err=>console.log(err))
             fetch(`/api/patient/viewItems?patientUsername=myy`, {
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
              
        },[])
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
         
             const response = await fetch(`/api/patient/checkout?patientUsername=myy`, {
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
    const handleUpdate= async (productName,quantity) => {
        try {
          
            let index=cartItems.findIndex(item => item.name === productName);
            cartItems[index].quantity=quantity;
          //patientUsername to be changed from login!!
               const response = await fetch(`/api/patient/changeAmountOfAnItem?patientUsername=myy&name=${productName}&quantity=${quantity}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
              });
              if (!response.ok) {       
                throw new Error("Failed to add order");
              }
             alert('quantity updated successfully')
            } catch (error) {
              console.error(error);
            }
    }
    return (
        <div>
            <label htmlFor="dropdown">Choose a shipping address:</label>
            <select id="dropdown" >

                {elementsArray.map((element, index) => (
                    <option key={index} value={element}>
                        {element}
                    </option>
                ))}

  
            </select>
            
            <p>Order Details:</p>
            {
             cartItems.map(obj=><p key={obj._id} >  
           
             name: {obj.name}<br></br>
              price: {obj.price}<br></br>
               quantity: <select id="quantity" >

{numbersArray.map((element, index) => (
    <option key={index} value={element}selected={element === obj.quantity}>
        {element}
    </option>
))}


</select>
              
               <br></br>
               <button onClick={() => handleUpdate(obj.name,document.getElementById('quantity').value)}>update</button>

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
