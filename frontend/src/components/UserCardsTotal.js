import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import patient from '../content/images/patient.jpg';
import admin from '../content/images/admin.jpg';
import pharmacist from '../content/images/pharmacist.png';



const Dashboard = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalPharmacists, setTotalPharmacists] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsResponse = await fetch('/api/administrator/viewAllPatients');
        const adminsResponse = await fetch('/api/administrator/viewAllAdmins');
        const pharmacistsResponse = await fetch('/api/administrator/viewAllPharmacists');

        const patientsData = await patientsResponse.json();
        const adminsData = await adminsResponse.json();
        const pharmacistsData = await pharmacistsResponse.json();

        setTotalPatients(patientsData.length);
        setTotalAdmins(adminsData.length);
        setTotalPharmacists(pharmacistsData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex justify-content-around mt-4">
      <Card border="success" style={{ width: '18rem', marginBottom: '35px', borderWidth: '2px' }}>
  <Card.Header className="text-center" style={{ background: '#44bab1', fontWeight: 'bold', color: 'black' }}>Total Patients</Card.Header>
  <Card.Body className="d-flex justify-content-between align-items-center">
    <Card.Img src={patient} alt="Image description" style={{ width: '60px', height: '60px', marginRight: '30px' }} />
    <div>
      <Card.Title style={{ marginLeft: '40px' }}>{totalPatients}</Card.Title>
      <Card.Text>Total number of patients in the system.</Card.Text>
    </div>
  </Card.Body>
</Card>



      <Card border="success" style={{ width: '18rem', marginBottom: '35px',borderWidth: '2px' }}>
      <Card.Header className="text-center" style={{ background: '#44bab1', fontWeight: 'bold', color: 'black' }}>Total Admins</Card.Header>
        <Card.Body className="d-flex align-items-center">
          <Card.Img src={admin} alt="Image description" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
          <div className="text-center">
            <Card.Title>{totalAdmins}</Card.Title>
            <Card.Text>Total number of admins in the system.</Card.Text>
          </div>
        </Card.Body>
      </Card>


      <Card border="success" style={{ width: '18rem', marginBottom: '35px', borderWidth: '2px' }}>
      <Card.Header className="text-center" style={{ background: '#44bab1', fontWeight: 'bold', color: 'black' }}>Total Pharmacists</Card.Header>
  <Card.Body className="d-flex align-items-center">
    <Card.Img src={pharmacist} alt="Image description" style={{ width: '58px', height: '58px', marginRight: '10px' }} />
    <div className="text-center">
      <Card.Title>{totalPharmacists}</Card.Title>
      <Card.Text>Total number of pharmacists in the system.</Card.Text>
    </div>
  </Card.Body>
</Card>

    </div>
  );
};

export default Dashboard;
