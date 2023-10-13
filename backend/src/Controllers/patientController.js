const Patient = require('../Models/patientModel');
const Medicine = require('../Models/medicineModel');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');

/*const newPatient = new Patient({
    username: 'john_doe',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'your_password_here',
    dateOfBirth: new Date('1990-01-15'),
    gender: 'Male',
    mobile_number: '123-456-7890',
    emergency_contact: {
      firstName: 'Emergency',
      middleName: 'Contact',
      lastName: 'Person',
      mobile_number: '987-654-3210',
      relation: 'Friend',
    },
    healthPackage: {
      name: 'Basic Health Package',
      discount: 10,
    },
  });

  newPatient.save();*/

module.exports = {  viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName }; 