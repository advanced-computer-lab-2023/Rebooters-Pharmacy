import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

const ViewCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await fetch('/api/patient/viewCartItems', {
          method: 'GET',
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCartItems;
