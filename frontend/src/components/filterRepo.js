import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicineDropdown = ({ handleFilter }) => {
  const [medicineNames, setMedicineNames] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [salesReport, setSalesReport] = useState([]);
  const [error, setError] = useState(null);

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

  const handleFilterButtonClick = async () => {
    try {
      const response = await axios.post('/api/pharmacist/filterSalesReport', {
        medicineName: selectedMedicine,
        saleDate: selectedDate, // Include the selected date in the API call
      });

      setSalesReport(response.data);
      setError(null);
    } catch (err) {
      setSalesReport([]);
      setError(err.response.data.error);
    }

    // Call the handleFilter function with the selected medicine and date
    handleFilter({ medicineName: selectedMedicine, saleDate: selectedDate });
  };

  return (
    <div>
      <label htmlFor="medicine-dropdown">Select Medicine:</label>
      <select
        id="medicine-dropdown"
        value={selectedMedicine}
        onChange={(e) => setSelectedMedicine(e.target.value)}
      >
        <option value="">Select a medicine</option>
        {medicineNames.length>0 && medicineNames.map((medicine) => (
          <option key={medicine.name} value={medicine.name}>
            {medicine.name}
          </option>
        ))}
      </select>

      <br />

      <label htmlFor="date-input">Select Date:</label>
      <input
        type="date"
        id="date-input"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <br />

      <button className='btn btn-primary' onClick={handleFilterButtonClick}>Filter</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {salesReport.length > 0 && (
        <div>
          <h2>Sales Report for {selectedMedicine}</h2>
          <table>
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Quantity Sold</th>
                <th>Sale Date</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map((sale) => (
                <tr key={sale.medicineName + sale.saleDate}>
                  <td>{sale.medicineName}</td>
                  <td>{sale.quantitySold}</td>
                  <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicineDropdown;
