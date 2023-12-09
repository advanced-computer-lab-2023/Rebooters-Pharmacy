import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

import '../styles/SalesReportGenerator.css';

const SalesReportGenerator = ({ userType }) => {
  const [chosenMonth, setChosenMonth] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const months = [
    '01', '02', '03', '04', '05', '06', '07',
    '08', '09', '10', '11', '12'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${userType}/generateSalesReport`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chosenMonth: `2023-${chosenMonth}` }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.salesData.length === 0) {
            setSalesData([]);
            setTotalSales(null);
            setMessage('No sales data available for the specified month');
            setError('');
          } else {
            setSalesData(data.salesData);
            setTotalSales(data.totalSales);
            setMessage('');
            setError('');
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error);
          setMessage('');
        }
      } catch (error) {
        setError('An error occurred while generating the sales report');
        setMessage('');
      }
    };

    fetchData();
  }, [chosenMonth, userType]);

  useEffect(() => {
    const barChartCanvas = document.getElementById('barChart');
    const pieChartCanvas = document.getElementById('pieChart');

    if (barChartCanvas && pieChartCanvas) {
      const barChart = new Chart(barChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: salesData.map(entry => entry.medicineName),
          datasets: [{
            label: 'Quantity Sold',
            data: salesData.map(entry => entry.quantitySold),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        }
      });

      const pieChart = new Chart(pieChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
          labels: salesData.map(entry => entry.medicineName),
          datasets: [{
            data: salesData.map(entry => entry.quantitySold),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
          }]
        }
      });

      return () => {
        barChart.destroy();
        pieChart.destroy();
      };
    }
  }, [salesData]);

  const handleMonthChange = (e) => {
    setChosenMonth(e.target.value);
  };

  const handleGenerateReport = () => {
    // Functionality handled in the useEffect hook
  };

  return (
    <div className="chart-container">
      <div className="left-container">
        <h2>Sales Data</h2>
        <div>
          <label htmlFor="month">Choose a month:</label>
          <select className="select" onChange={handleMonthChange} value={chosenMonth}>
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <button className="report-button" onClick={() => handleGenerateReport()}>Generate Report</button>
        </div>
        <table className="table-container">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Quantity Sold</th>
              <th>Sale Date</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.medicineName}</td>
                <td>{entry.quantitySold}</td>
                <td>{new Date(entry.saleDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total Sales: {totalSales}</p>
      </div>
      <div className="right-container">
      <canvas className="chart-canvas" id="barChart" width="300" height="200"></canvas>
      <canvas className="chart-canvas" id="pieChart" width="300" height="200"></canvas>
      </div>
    </div>
  );
};

export default SalesReportGenerator;
