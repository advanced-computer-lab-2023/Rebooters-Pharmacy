const express = require('express') //require or import express
const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const {addAdministrator,
    removeUserFromSystem,
    viewPharmacistApplication,
    viewPharmacistInformation,
    viewPatientInformation, generateSalesReport, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName,approvePharmacistRequest,rejectPharmacistRequest, logout, changePassword} = require('../Controllers/AdminController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get('/logout', requireAuth, logout);

// router.get('/requestPasswordResetOTP', requireAuth, requestPasswordResetOTP);

// router.post('/resetPasswordWithOTP', requireAuth, resetPasswordWithOTP);

router.post('/changePassword', requireAuth, changePassword);

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

router.post('/generateSalesReport' , requireAuth, generateSalesReport);


module.exports = router //we need to export that router at the end so that App.js can access it

