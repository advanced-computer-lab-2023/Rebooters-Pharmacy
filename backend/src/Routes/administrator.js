const express = require('express') //require or import express
const {addAdministrator,
    removeUserFromSystem,
    viewPharmacistApplication,
    viewPharmacistInformation,
    viewPatientInformation, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName,approvePharmacistRequest,rejectPharmacistRequest} = require('../Controllers/AdminController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.post('/addAdministrator' , addAdministrator);

router.delete('/removeUserFromSystem' , removeUserFromSystem);

router.get('/viewPharmacistApplication' , viewPharmacistApplication);

router.post('/viewPharmacistInformation' , viewPharmacistInformation);

router.post('/viewPatientInformation' , viewPatientInformation);

router.get('/viewMedicineInventory', viewMedicineInventory);

router.post('/searchMedicineByName', searchMedicineByName);

router.post('/filterMedicineByMedicinalUse', filterMedicineByMedicinalUse);

router.post('/approvePharmacistRequest' , approvePharmacistRequest);

router.post('/rejectPharmacistRequest' , rejectPharmacistRequest);


module.exports = router //we need to export that router at the end so that App.js can access it

