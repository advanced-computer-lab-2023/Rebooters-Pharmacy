const express = require('express') //require or import express
const {addAdministrator,
    removeUserFromSystem,
    viewPharmacistApplication,
    viewPharmacistInformation,
    viewPatientInformation, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName} = require('../Controllers/AdminController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.post('/addAdministrator' , addAdministrator);

router.delete('/removeUserFromSystem/:id' , removeUserFromSystem);

router.get('/viewPharmacistApplication' , viewPharmacistApplication);

router.get('/viewPharmacistInformation' , viewPharmacistInformation);

router.get('/viewPatientInformation' , viewPatientInformation);

router.get('/viewMedicineInventory', viewMedicineInventory);

router.post('/searchMedicineByName', searchMedicineByName);

router.post('/filterMedicineByMedicinalUse', filterMedicineByMedicinalUse);


module.exports = router //we need to export that router at the end so that App.js can access it

