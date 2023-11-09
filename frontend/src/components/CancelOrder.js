import React from 'react';

const CancelOrder = ({ orderId }) => {
  const handleCancelOrder = async () => {
    try {
      const username = document.cookie.split('; ').find(row => row.startsWith('username=')).split('=')[1];
      
      const response = await fetch('/api/patient/cancelOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, username }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Log the success message or handle it in the component
        // Perform additional actions on successful order cancellation
      } else {
        const errorData = await response.json();
        console.error(errorData.message); // Log or handle the error message
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCancelOrder}>Cancel Order</button>
    </div>
  );
};

export default CancelOrder;
