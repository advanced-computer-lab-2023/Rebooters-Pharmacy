import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';

const UserPieChart = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [patients, setPatients] = useState([]);

  const fetchPharmacists = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllPharmacists");
      if (response.ok) {
        const json = await response.json();
        setPharmacists(json);
      }
    } catch (error) {
      console.error("Error fetching pharmacists:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllAdmins");
      if (response.ok) {
        const json = await response.json();
        setAdmins(json);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/administrator/viewAllPatients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const json = await response.json();
      setPatients(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPharmacists();
    fetchAdmins();
    fetchPatients();
  }, []);

  // Calculate the total number of users
  const totalUsers = pharmacists.length + admins.length + patients.length;

  // Create data for the pie chart
  const data = {
    labels: ['Pharmacists', 'Admins', 'Patients'],
    datasets: [
      {
        data: [pharmacists.length, admins.length, patients.length],
        backgroundColor: ['#1AAC83', '#F57E57', '#06A3DA'],
        hoverBackgroundColor: ['#1AAC83', '#F57E57', '#06A3DA'],
      },
    ],
  };

  return (
    <div>
      <h2 style={{textAlign:'center'}}>Users According to Type</h2>
      <p style={{textAlign:'center'}}><strong>Total Users: {totalUsers}</strong></p>
      <Pie data={data} />
    </div>
  );
};

export default UserPieChart;