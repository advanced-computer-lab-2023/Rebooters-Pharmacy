import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/SalesReportGenerator.css';
import axios from 'axios';

const SalesReportGenerator = ({ userType }) => {
  const [chosenMonth, setChosenMonth] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [chartsVisible, setChartsVisible] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [medicineNames, setMedicineNames] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const months = [
    '01', '02', '03', '04', '05', '06', '07',
    '08', '09', '10', '11', '12'
  ];

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('/api/pharmacist/viewMedicineInventoryPharmacist');
        const data = await response.json();
        setMedicineNames(data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    if (chartsVisible) {
      const barChartCanvas = document.getElementById('barChart');
      const pieChartCanvas = document.getElementById('pieChart');

      if (barChartCanvas && pieChartCanvas) {
        const uniqueMedicineNames = Array.from(new Set(salesData.map(entry => entry.medicineName)));
        const aggregatedQuantities = uniqueMedicineNames.map(medicineName => {
          const quantities = salesData.filter(entry => entry.medicineName === medicineName)
                                      .map(entry => entry.quantitySold);
          return quantities.reduce((sum, quantity) => sum + quantity, 0);
        });

        const barChart = new Chart(barChartCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: uniqueMedicineNames,
            datasets: [{
              label: 'Quantity Sold',
              data: aggregatedQuantities,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          }
        });

        const pieChart = new Chart(pieChartCanvas.getContext('2d'), {
          type: 'pie',
          data: {
            labels: uniqueMedicineNames,
            datasets: [{
              data: aggregatedQuantities,
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
    }
  }, [chartsVisible, salesData]);

  const handleMonthChange = (e) => {
    setChosenMonth(e.target.value);
    setError('');
    setShowTable(false); // Reset to hide the table when a new month is selected
    setChartsVisible(false);
    setShowAlert(false);
  };

  const handleGenerateReport = async () => {
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
        setSalesData(data.salesData);
        setTotalSales(data.totalSales);
        setMessage('');
        setError('');
        setChartsVisible(true);
        setShowTable(true);

        // Update the medicine names for the filter dropdown
        const uniqueMedicineNames = Array.from(new Set(data.salesData.map(entry => entry.medicineName)));
        setMedicineNames(uniqueMedicineNames);

        setShowAlert(false);
      } else {
        const errorData = await response.json();
        setError('No sales data available for the specified month.');
        setMessage('');
        setSalesData([]);
        setTotalSales(null);
        setChartsVisible(false);
        setShowTable(false);

        // Set medicineNames to an empty array if there's an error
        setMedicineNames([]);
      }
    } catch (error) {
      setError('An error occurred while generating the sales report');
      setMessage('');
      setChartsVisible(false);
      setShowTable(false);

      // Set medicineNames to an empty array if there's an error
      setMedicineNames([]);
    }
  };

  const handleFilterButtonClick = async () => {
    try {
      const response = await axios.post('/api/pharmacist/filterSalesReport', {
        medicineName: selectedMedicine,
        saleDate: selectedDate,
      });

      setSalesData(response.data);
      setError(null);
      setChartsVisible(false);
      setShowTable(true);
      setShowAlert(false); // Reset the alert when new data is loaded

      // Display alert if no data is found
      if (response.data.length === 0) {
        setShowAlert(true);
      }
    } catch (err) {
      setError(err.response.data.error);
      setChartsVisible(false);
      setShowTable(false);
    }
  };

  const aggregateQuantities = (data) => {
    const aggregatedData = [];
    data.forEach((entry) => {
      const existingEntry = aggregatedData.find(
        (aggEntry) =>
          aggEntry.medicineName === entry.medicineName &&
          new Date(aggEntry.saleDate).toLocaleDateString() ===
            new Date(entry.saleDate).toLocaleDateString()
      );
      if (existingEntry) {
        existingEntry.quantitySold += entry.quantitySold;
      } else {
        aggregatedData.push({ ...entry });
      }
    });
    return aggregatedData;
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
          <button className="report-button" onClick={handleGenerateReport}>Generate Report</button>
        </div>
        <div className="alert alert-danger" role="alert" style={{ display: error ? 'block' : 'none' }}>
          {error}
        </div>
        {showTable && (
          <>
            <table className="table-container">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Quantity Sold</th>
                  <th>Sale Date</th>
                </tr>
              </thead>
              <tbody>
                {aggregateQuantities(salesData).map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.medicineName}</td>
                    <td>{entry.quantitySold}</td>
                    <td>{new Date(entry.saleDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Total Sales: {totalSales}</p>
          </>
        )}
      </div>
      <div className="right-container" style={{ marginRight: userType !== 'pharmacist' ? '300px' : '0' }}>
        {chartsVisible && (
          <>
            <canvas className="chart-canvas" id="barChart" width="300" height="200"></canvas>
            <canvas className="chart-canvas" id="pieChart" width="300" height="200"></canvas>
          </>
        )}
      </div>
      {userType === 'pharmacist' && showTable && (
        <div className="filter-container" >
          <label htmlFor="medicine-dropdown">Select Medicine:</label>
          <select
            id="medicine-dropdown"
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
          >
            <option value="">Select a medicine</option>
            {Array.from(new Set(salesData.map(entry => entry.medicineName))).map((medicineName) => (
              <option key={medicineName} value={medicineName}>
                {medicineName}
              </option>
            ))}
          </select>

          <label htmlFor="date-input">Select Date:</label>
          <input
            type="date"
            id="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button className='btn btn-primary' onClick={handleFilterButtonClick}>Filter</button>
          {showAlert && (
            <div className="alert alert-danger mt-3" role="alert">
              No medicine found for the selected date.
            </div>
          )}

          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default SalesReportGenerator;
