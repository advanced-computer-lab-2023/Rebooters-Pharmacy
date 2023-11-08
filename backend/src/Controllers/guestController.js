const Guest = require('../Models/guestModel') //this imports what we exported from guestModel.js
const Patient = require('../Models/patientModel'); // Import the Patient model
const Admin = require('../Models/administratorModel');
const Pharmacist = require('../Models/pharmacistModel');
const NewPharmacistRequest = require('../Models/newPharmacistRequestModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {createToken} = require('./authController');
const maxAge = 3 * 24 * 60 * 60;

const login = async(req, res) => {
  const { username, password } = req.body;
  try {
    let user;
    type = "";

    // Search for the username in Patients
    user = await Patient.findOne({ username });
    type = "patient";
    if (!user) {
        // Search for the username in Admins
        user = await Admin.findOne({ username });
        type = "admin";
    }
    if (!user) {
        // Search for the username in Pharmacists
        user = await Pharmacist.findOne({ username });
        type = "pharmacist";
    }

    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const token = createToken(user.username);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.cookie('userType', type, { httpOnly: true, maxAge: maxAge * 1000 });
            res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ username, token, type});
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }

        //DO REDIRECTING ACCORDING TO TYPE

    } else {
        res.status(401).json({ error: 'User not found' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
}
};

const createPatient = async (req, res) => {
  try {
    const {username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact} = req.body; 
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newPatient = new Patient({username,name,email,password:hashedPassword,dateOfBirth,gender,mobile_number,emergency_contact});
    await newPatient.save();
    const token = createToken(newPatient._id);
    res.status(200).json({username, token});
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
  


module.exports = {createPatient, createNewPharmacistRequest, login, createToken};





