import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Wallet = ({ userType }) => {
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch(`/api/${userType}/checkWalletBalance`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.walletBalance !== undefined) {
            setWalletBalance(data.walletBalance);
          }
        } else {
          console.error('Failed to fetch wallet balance');
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchWalletBalance();
  }, [userType]);

  return (
    <div className="container">
      <div className="card p-2" style={{ width: '20%'}}>
        <h5>Wallet Balance:</h5>
        <p>{walletBalance} $</p> 
      </div>
    </div>
  );
};

export default Wallet;
