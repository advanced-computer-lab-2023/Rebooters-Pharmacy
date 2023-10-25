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

 const createNewPharmacistRequest = async (req, res) => {
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
  
    const newPharmacistRequest = new NewPharmacistRequest({
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliation,
      educationalBackground,
    });
  
    if (req.files) {
      if (req.files.idDocument) {
        newPharmacistRequest.idDocument.data = req.files.idDocument[0].buffer;
        newPharmacistRequest.idDocument.contentType = req.files.idDocument[0].mimetype;
        newPharmacistRequest.idDocument.filename = req.files.idDocument[0].originalname;
      }
  
      if (req.files.pharmacyDegreeDocument) {
        newPharmacistRequest.pharmacyDegreeDocument.data = req.files.pharmacyDegreeDocument[0].buffer;
        newPharmacistRequest.pharmacyDegreeDocument.contentType = req.files.pharmacyDegreeDocument[0].mimetype;
        newPharmacistRequest.pharmacyDegreeDocument.filename = req.files.pharmacyDegreeDocument[0].originalname;
      }
  
      if (req.files.workingLicenseDocument) {
        newPharmacistRequest.workingLicenseDocument.data = req.files.workingLicenseDocument[0].buffer;
        newPharmacistRequest.workingLicenseDocument.contentType = req.files.workingLicenseDocument[0].mimetype;
        newPharmacistRequest.workingLicenseDocument.filename = req.files.workingLicenseDocument[0].originalname;
      }
    }
  
    await newPharmacistRequest.save();
  
    res.status(201).json(newPharmacistRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the patient.' });
  }
  };
  


module.exports = {
  createPatient, createNewPharmacistRequest
};





