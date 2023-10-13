const Administrator = require('../Models/administratorModel');
const Pharmacist = require('../Models/pharmacistModel');
const Patient = require('../Models/patientModel');
const NewPharmacistRequest = require('../Models/newPharmacistRequestModel');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');

const mongoose = require('mongoose');


    // Add another administrator with a set username and password
const addAdministrator= async (req, res) => {
      try {
        const { username, password } = req.body;
        const newAdministrator = new Administrator({ username, password });
        const savedAdministrator = await newAdministrator.save();
        res.status(201).json(savedAdministrator);
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

    
module.exports = {  
  addAdministrator,
  removeUserFromSystem,
  viewPharmacistApplication,
  viewPharmacistInformation,
  viewPatientInformation,
  viewMedicineInventory,
  filterMedicineByMedicinalUse,
  searchMedicineByName
 }; 