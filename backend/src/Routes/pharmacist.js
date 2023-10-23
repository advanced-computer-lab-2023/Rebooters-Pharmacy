const express = require('express') //require or import express
const {addMedicine, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName,editMedicine, viewMedicineInventoryPharmacist} = require('../Controllers/PharmacistController') //we're destructuring so we need curly braces

const multer = require('multer'); 
const storage = multer.diskStorage({
    destination: (req, image, cb) => {
      // Set the directory where uploaded files will be saved
      cb(null, '../../frontend/public');
    },
    filename: (req, image, cb) => {
      // Define the file name for each uploaded file (e.g., using a timestamp)
      cb(null, image.originalname);
    },
  });
  
  
const upload = multer({ storage: storage });
//const upload= require ('../Controllers/uploadMiddleware');
const router = express.Router() //create a router

router.post('/addMedicine' , upload.single('image'),addMedicine);
router.get('/viewMedicineInventory', viewMedicineInventory);
router.post('/filterMedicineByMedicinalUse', filterMedicineByMedicinalUse);
router.post('/searchMedicineByName', searchMedicineByName);
router.patch('/editMedicine',editMedicine);
router.get('/viewMedicineInventoryPharmacist', viewMedicineInventoryPharmacist);
module.exports = router //we need to export that router at the end so that App.js can access it