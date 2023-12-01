import React, { useState } from 'react';
import '../styles/SalesReportGenerator.css';

const SalesReportGenerator = () => {
  const [chosenMonth, setChosenMonth] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const months = [
    '01', '02', '03', '04', '05', '06', '07',
    '08', '09', '10', '11', '12'
  ];

  const handleMonthChange = (e) => {
    setChosenMonth(e.target.value);
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/api/administrator/generateSalesReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chosenMonth: `2023-${chosenMonth}` }), // Format the chosen month
      });

      if (response.ok) {
        const data = await response.json();
        if (data.salesData.length === 0) {
          // No sales data for the chosen month
          setSalesData([]);
          setTotalSales(null);
          setMessage('No sales data available for the specified month');
          setError('');
        } else {
          // Sales data is available
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

  return (
    <div>
      <h2>Sales Report Generator</h2>
      <div>
        <label htmlFor="month">Choose a month:</label>
        <select id="month" onChange={handleMonthChange} value={chosenMonth}>
          <option value="">Select Month</option>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
      {salesData.length > 0 && (
        <div>
          <h3>Sales Data</h3>
          <table>
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
          {/* Display total sales */}
          <p>Total Sales: {totalSales}</p>
        </div>
      )}
    </div>
  );
};

export default SalesReportGenerator;
