import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const MonthlyOrdersChart = () => {
  const [monthlyOrders, setMonthlyOrders] = useState([]);

  const fetchMonthlyOrders = async () => {
    try {
      const response = await fetch('/api/pharmacist/getMonthlyPending');
      if (response.ok) {
        const data = await response.json();
        setMonthlyOrders(data);
      }
    } catch (error) {
      console.error('Error fetching monthly orders:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyOrders();
  }, []);

  const data = {
    labels: monthlyOrders.map(entry => entry.month),
    datasets: [
      {
        label: 'Total Cost',
        data: monthlyOrders.map(entry => entry.totalCost),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '500px' }}>
      <h2>Monthly Orders Total</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyOrdersChart;
