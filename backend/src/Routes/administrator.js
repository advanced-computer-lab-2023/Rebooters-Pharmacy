const express = require('express') //require or import express
const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const {addAdministrator,
    removeUserFromSystem,
    viewPharmacistApplication,
    viewPharmacistInformation,
    viewPatientInformation, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName,approvePharmacistRequest,rejectPharmacistRequest} = require('../Controllers/AdminController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.post('/addAdministrator' , requireAuth, addAdministrator);

router.delete('/removeUserFromSystem' ,requireAuth, removeUserFromSystem);

router.get('/viewPharmacistApplication' , requireAuth, viewPharmacistApplication);

router.post('/viewPharmacistInformation' , requireAuth, viewPharmacistInformation);

router.post('/viewPatientInformation' ,requireAuth, viewPatientInformation);

router.get('/viewMedicineInventory', requireAuth, viewMedicineInventory);

router.post('/searchMedicineByName', requireAuth, searchMedicineByName);

router.post('/filterMedicineByMedicinalUse',requireAuth, filterMedicineByMedicinalUse);

router.post('/approvePharmacistRequest' ,requireAuth, approvePharmacistRequest);

router.post('/rejectPharmacistRequest' , requireAuth, rejectPharmacistRequest);


module.exports = router //we need to export that router at the end so that App.js can access it

