import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const ViewCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const numbersArray = Array.from({ length: 20 }, (_, i) => i + 1);
   const[selected,setSelected]=useState(0);
  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await fetch('/api/patient/viewCartItems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin', // Include cookies
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
  }, []); // Run this effect only once on component mount

  const handleRemoveItem = async (medicineName) => {
    try {
      const response = await fetch('/api/patient/removeCartItem', {
        method: 'POST',
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
      alert(quantity)
        let index=cartItems.findIndex(item => item.name === productName);
        cartItems[index].quantity=quantity;
           const response = await fetch(`/api/patient/changeAmountOfAnItem?name=${productName}&quantity=${quantity}`, {
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

      {error && <p className="text-danger">{error}</p>}
      <h2>Cart Items</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Price</th>
            <th>Actions</th>

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
                <button onClick={() => handleRemoveItem(item.name)}>Remove</button>
              </td>
              <td>
                <button onClick={() => handleUpdateItem(item.name,document.getElementById('quantity').value)}>Update</button>
              </td>
              <td>
              <select id="quantity" >

{numbersArray.map((element, index) => (
    <option  key={index} value={element }selected={element === item.quantity}>
        {element}
    </option>
))}


</select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCartItems;
