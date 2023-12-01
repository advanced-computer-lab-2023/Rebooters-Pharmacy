import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Wallet from "./Wallet";

const ViewCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const numbersArray = Array.from({ length: 20 }, (_, i) => i + 1);
   const[addresses,setAddresses]=useState([]);
  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await fetch('/api/patient/viewCartItems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data); // Set retrieved cart items in state
          setError('');
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (error) {
        setError('Error retrieving cart items');
      }
    };

    getCartItems();
  }, [cartItems]); // Run this effect only once on component mount

  const handleRemoveItem = async (medicineName) => {
    try {
      const response = await fetch('/api/patient/removeCartItem', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies
        body: JSON.stringify({ medicineName }),
      });

      if (response.ok) {
        const updatedCartItems = cartItems.filter(item => item.name !== medicineName);
        setCartItems(updatedCartItems);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Error removing medicine from the cart');
    }
  };
  const handleUpdateItem= async (productName,quantity) => {
    try {
      let newValue=(document.getElementById("mySelect_"+quantity).value);
        let index=cartItems.findIndex(item => item.name === productName);
        cartItems[index].quantity=newValue;
           const response = await fetch(`/api/patient/changeAmountOfAnItem?name=${productName}&quantity=${newValue}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
          if (!response.ok) {       
            throw new Error("Failed to add order");
          }
          
          document.getElementById("mySelect_"+quantity).value=newValue;
          alert('quantity updated successfully')
        } catch (error) {
          console.error(error);
        
        }
}
  return (
  
      <div>
      <Wallet userType="patient"/>
        {error && <p className="text-danger">{error}</p>}
        <h4>Cart Items:</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Price</th>
              <th>Actions</th>
              <th>Quantity</th>
             
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleRemoveItem(item.name)}>Remove</button>
                </td>
                
                <td>
                  <div>
                    <select id={`mySelect_${index}`} value={item.quantity} onChange={(e) => handleUpdateItem(item.name, index)}>
                      {numbersArray.map((element, innerIndex) => (
                        <option key={innerIndex} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

export default ViewCartItems;
