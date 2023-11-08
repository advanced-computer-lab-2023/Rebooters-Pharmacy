const express = require('express'); //require or import express

const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const { checkout, viewMedicineInventory, filterMedicineByMedicinalUse,
    AddNewDeliveryAdress, searchMedicineByName, cancelOrder, 
    removeCartItem, changeAmountOfAnItem,viewItems, 
    viewCartItems,viewDeliveryAdresses,addMedicineToCart, 
    viewOrderDetails, logout, changePassword  } = require('../Controllers/patientController') //we're destructuring so we need curly braces

const router = express.Router() //create a router
router.get('/logout', requireAuth, logout);

// router.get('/requestPasswordResetOTP', requireAuth, requestPasswordResetOTP);

// router.post('/resetPasswordWithOTP', requireAuth, resetPasswordWithOTP);

router.post('/changePassword', requireAuth, changePassword);

router.get('/viewMedicineInventory', requireAuth, viewMedicineInventory);

router.post('/searchMedicineByName', requireAuth, searchMedicineByName);

router.post('/filterMedicineByMedicinalUse', requireAuth, filterMedicineByMedicinalUse);

router.post('/cancelOrder/:username/:orderId',requireAuth, cancelOrder);
//http://localhost:8000/api/patient/cancelOrder/exampleUser/123

router.delete('/removeCartItem/:patientUsername/:medicineName',requireAuth, removeCartItem);

router.get('/viewCartItems/:patientUsername', requireAuth, viewCartItems);
router.post('/viewDeliveryAddresses', requireAuth, viewDeliveryAdresses);
router.post('/viewItems', requireAuth, viewItems);

router.put('/addNewDeliveryAddress', requireAuth, AddNewDeliveryAdress);
router.put('/changeAmountOfAnItem', requireAuth, changeAmountOfAnItem);
router.post('/checkout', requireAuth, checkout);

router.post('/addMedicineToCart', requireAuth, addMedicineToCart);

router.post('/addMedicineToCart',requireAuth, addMedicineToCart);
router.get('/viewOrderDetails/:patientUsername/:orderId',requireAuth, viewOrderDetails);

module.exports = router //we need to export that router at the end so that App.js can access it