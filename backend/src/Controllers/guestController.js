/*const Guest = require('../Models/guestModel') //this imports what we exported from guestModel.js
const Patient = require('../Models/patientModel'); // Import the Patient model
const NewPharmacistRequest = require('../Models/newPharmacistRequestModel');
const mongoose = require('mongoose')


const createPatient = async (req, res) => {
    try {
      const {username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact} = req.body; 
      const newPatient = new Patient({username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact});
      await newPatient.save();
      res.status(201).json(newPatient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the patient.' });
    }
  };

const createNewPharmacistRequest =  async (req, res) => {
  try {
    const {username,name,email ,password,dateOfBirth,hourlyRate,affiliation,educationalBackground} = req.body; 
    const newPharmacistRequest = new NewPharmacistRequest({username,name,email,password,dateOfBirth,hourlyRate,affiliation,educationalBackground});
    await newPharmacistRequest.save();
    res.status(201).json(newPharmacistRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the pharmacist request.' });
  }
};



module.exports = {
  createPatient, createNewPharmacistRequest
};

  */
  const Guest = require('../Models/guestModel');
const Patient = require('../Models/patientModel');
const PharmacistRequest = require('../Models/PharmacistRequest');
const mongoose = require('mongoose')

const registerPatient = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContactFullName,
      emergencyContactMobileNumber,
      emergencyContactRelation,
    } = req.body;

    // Create a new patient using the provided information
    const patient = new Patient({
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact: {
        fullName: emergencyContactFullName,
        mobileNumber: emergencyContactMobileNumber,
        relation: emergencyContactRelation,
      },
    });

    // Save the patient to the database
    await patient.save();

    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering as a patient' });
  }
};

const submitPharmacistRequest = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliation,
      educationalBackground,
    } = req.body;

    // Create a new pharmacist request using the provided information
    const pharmacistRequest = new PharmacistRequest({
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliation,
      educationalBackground,
    });

    // Save the pharmacist request to the database
    await pharmacistRequest.save();

    res.status(201).json({ message: 'Pharmacist request submitted successfully', pharmacistRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while submitting the pharmacist request' });
  }
};

module.exports = {
  registerPatient,
  submitPharmacistRequest,
};

  