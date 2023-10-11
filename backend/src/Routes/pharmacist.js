const express = require('express') //require or import express
const {addMedicine, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName,editMedicine, viewMedicineInventoryPharmacist} = require('../Controllers/PharmacistController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.post('/addMedicine' , addMedicine);
router.get('/viewMedicineInventory', viewMedicineInventory);
router.post('/filterMedicineByMedicinalUse', filterMedicineByMedicinalUse);
router.post('/searchMedicineByName', searchMedicineByName);
router.patch('/editMedicine',editMedicine);
router.get('/viewMedicineInventoryPharmacist', viewMedicineInventoryPharmacist);
module.exports = router //we need to export that router at the end so that App.js can access it