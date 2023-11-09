import React, { useState } from 'react';
//      const username = document.cookie.split('; ').find((row) => row.startsWith('username=')).split('=')[1];


const RemoveCartItem = () => {
  const [medicineName, setMedicineName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRemoveItem = async () => {
    try {
      const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, '$1');

      const response = await fetch('/api/patient/removeCartItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicineName, username }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setMessage('');
        setError(data.message);
      }
    } catch (error) {
      setError('Error removing medicine from the cart');
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        placeholder="Medicine Name"
      />
      <button onClick={handleRemoveItem}>Remove Medicine</button>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default RemoveCartItem;


       