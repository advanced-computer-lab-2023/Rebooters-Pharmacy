const express = require('express') //require or import express
const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const {generateSalesReport, filterSalesReport,
  addMedicine, 
  viewMedicineInventory,
   filterMedicineByMedicinalUse,
    searchMedicineByName,editMedicine,
     viewMedicineInventoryPharmacist, logout, changePassword,
      viewAllChats, sendMessageToChat, getOutOfStockMedicines, 
      checkWalletBalance} = require('../Controllers/PharmacistController') //we're destructuring so we need curly braces

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

router.get('/logout', requireAuth, logout);
router.post('/changePassword', requireAuth, changePassword);
router.post('/addMedicine' , requireAuth, upload.single('image'),addMedicine);
router.get('/viewMedicineInventory',viewMedicineInventory);
router.post('/filterMedicineByMedicinalUse',requireAuth, filterMedicineByMedicinalUse);
router.post('/searchMedicineByName', requireAuth, searchMedicineByName);
router.patch('/editMedicine',requireAuth, upload.single('image'), editMedicine);
router.get('/viewMedicineInventoryPharmacist', requireAuth, viewMedicineInventoryPharmacist);
router.get('/viewAllChats', requireAuth, viewAllChats);
router.post('/sendMessageToChat', requireAuth, sendMessageToChat);
router.get('/getOutOfStockMedicines', requireAuth, getOutOfStockMedicines);
router.get('/checkWalletBalance', requireAuth, checkWalletBalance);

router.post('/generateSalesReport' , requireAuth, generateSalesReport);
// Add a new route to handle fetching all medicines
router.post('/filterSalesReport',requireAuth, filterSalesReport);



module.exports = router //we need to export that router at the end so that App.js can access it