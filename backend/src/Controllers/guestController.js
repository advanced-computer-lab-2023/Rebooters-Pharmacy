const Guest = require('../Models/guestModel') //this imports what we exported from guestModel.js
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
    const {username,name,email,password,dateOfBirth,hourlyRate,affiliation,educationalBackground} = req.body; 
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

  