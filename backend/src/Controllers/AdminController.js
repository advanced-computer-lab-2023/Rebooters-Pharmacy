const Administrator = require('../Models/administratorModel');
const Pharmacist = require('../Models/pharmacistModel');
const Patient = require('../Models/patientModel');
const NewPharmacistRequest = require('../Models/newPharmacistRequestModel');
const bcrypt = require('bcrypt');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');
const {logout, changePassword, createToken} = require('./authController');
const mongoose = require('mongoose');

const addAdministrator= async (req, res) => {
      try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdministrator = new Administrator({ username, password:hashedPassword });
        const savedAdministrator = await newAdministrator.save();
        const token = createToken(newAdministrator._id);
        res.status(201).json({ username, token, savedAdministrator });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding administrator' });
      }
}
  

const removeUserFromSystem = async (req, res) => {
  try {
    const { username } = req.body;
    const removedPharmacist = await Pharmacist.findOneAndDelete({ username });
    if (!removedPharmacist) {
      const removedPatient = await Patient.findOneAndDelete({ username });
      if (!removedPatient) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing user from the system' });
  }
};



    // View all information uploaded by a pharmacist to apply to join the platform
const viewPharmacistApplication = async (req, res) => {
      try {
        // Fetch all pharmacist application data (customize this based on your data structure)
        const pharmacistApplications = await NewPharmacistRequest.find({ status: 'pending' });
        res.status(200).json(pharmacistApplications);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pharmacist applications' });
      }
};



    // View a pharmacist's information
const viewPharmacistInformation = async (req, res) => {
      try {
        const {pharmacistUsername} = req.body;
        const pharmacist = await Pharmacist.find({username : pharmacistUsername});
        // if (!pharmacist) {
        //   return res.status(404).json({ message: 'Pharmacists not found' });
        // }
        res.status(200).json(pharmacist);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pharmacist information' });
      }
}
  
    // View a patient's basic information
const viewPatientInformation = async (req, res) => {
      try {
        const {patientUsername} = req.body;
        const patient = await Patient.find({username : patientUsername});
        if (!patient) {
          return res.status(404).json({ message: 'Patients not found' });
        }
        
        res.status(200).json(patient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching patient information' });
      }
}

const approvePharmacistRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await NewPharmacistRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'accepted';
    await request.save();

    res.status(200).json({ message: 'Request accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while approving the request' });
  }
};

const rejectPharmacistRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await NewPharmacistRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rejecting the request' });
  }
};

    
module.exports = {  
  addAdministrator,
  removeUserFromSystem,
  viewPharmacistApplication,
  viewPharmacistInformation,
  viewPatientInformation,
  viewMedicineInventory,
  filterMedicineByMedicinalUse,
  searchMedicineByName,
  approvePharmacistRequest,
  rejectPharmacistRequest,
  logout, changePassword, createToken
 }; 