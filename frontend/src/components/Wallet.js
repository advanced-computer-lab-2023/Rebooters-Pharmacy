import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

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
      <Card border="info" style={{ width: '18rem' }}>
        <Card.Header>Wallet Balance</Card.Header>
        <Card.Body>
          <Card.Title>{walletBalance} $</Card.Title>
          <Card.Text>
            This is your wallet balance. Use it wisely!
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
    </div>
  );
};

export default Wallet;
