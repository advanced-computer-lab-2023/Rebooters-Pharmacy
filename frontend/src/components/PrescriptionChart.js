// MedicinePrescriptionChart.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import '../styles/medicineChart.css';

const PrescriptionChart = () => {
  const [medicineCounts, setMedicineCounts] = useState([]);

  const fetchMedicineCounts = async () => {
    try {
      const response = await fetch('/api/pharmacist/getMedicineCountByPrescription');
      if (response.ok) {
        const data = await response.json();
        setMedicineCounts(data);
      }
    } catch (error) {
      console.error('Error fetching medicine counts:', error);
    }
  };

  useEffect(() => {
    fetchMedicineCounts();
  }, []);

  const chartData = {
    labels: ['Prescription Needed', 'Prescription Not Needed'],
    datasets: [
      {
        label: 'Medicine Count',
        data: [medicineCounts.prescriptionNeededCount, medicineCounts.prescriptionNotNeededCount],
        backgroundColor: ['#36a2eb', '#4caf50'],
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='medicineChart-container'>
      <h3 style={{ fontFamily: 'serif' }}>Medicine Prescription Chart</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default PrescriptionChart;
