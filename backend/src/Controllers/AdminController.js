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
  
    // Remove a pharmacist or patient from the system
const removeUserFromSystem =  async (req, res) => {
      try {
        const {id} = req.params; // ID of the pharmacist or patient to remove
        // Check if the user is a pharmacist or patient and remove accordingly
        //const removedUser = await (Pharmacist.findOneAndRemove(userId) || Patient.findOneAndRemove(userId));
        const removedUserPharmacist = await Pharmacist.findOneAndDelete({_id : id});
        const removedUserPatient = await Patient.findOneAndDelete({_id : id});  
       
        console.log(removedUserPatient);
        console.log(removedUserPharmacist);
        if (removedUserPharmacist==null && removedUserPatient==null) {
          return res.status(404).json({ message: 'User not found' });
        }
        else{
        res.status(200).json({ message: 'User removed successfully' });
      }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing user from the system' });
      }
}
  
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
        const pharmacistId = req.params.id; // ID of the pharmacist to view
        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
          return res.status(404).json({ message: 'Pharmacist not found' });
        }
        res.status(200).json(pharmacist);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pharmacist information' });
      }
}
  
    // View a patient's basic information
const viewPatientInformation = async (req, res) => {
      try {
        const patientId = req.params.id; // ID of the patient to view
        const patient = await Patient.findById(patientId);
        if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        // Customize this to send only basic patient information
        const basicInfo = {
          name: patient.name,
          email: patient.email,
          // Add other basic fields as needed
        };
        res.status(200).json(basicInfo);
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