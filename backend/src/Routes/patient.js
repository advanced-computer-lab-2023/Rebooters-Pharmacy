const express = require('express') //require or import express
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName} = require('../Controllers/PatientController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get('/viewMedicineInventory', viewMedicineInventory);

router.post('/searchMedicineByName', searchMedicineByName);

router.post('/filterMedicineByMedicinalUse', filterMedicineByMedicinalUse);

module.exports = router //we need to export that router at the end so that App.js can access it