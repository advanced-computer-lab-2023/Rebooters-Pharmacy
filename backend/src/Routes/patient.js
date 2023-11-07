const express = require('express'); //require or import express

const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const { checkout, viewMedicineInventory, filterMedicineByMedicinalUse,
    AddNewDeliveryAdress, searchMedicineByName, cancelOrder, 
    removeCartItem, changeAmountOfAnItem,viewItems,changeAmountOfAnItem, 
    viewCartItems,viewDeliveryAdresses,addMedicineToCart, 
    viewOrderDetails  } = require('../Controllers/patientController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get('/viewMedicineInventory', requireAuth, viewMedicineInventory);

router.post('/searchMedicineByName', requireAuth, searchMedicineByName);

router.post('/filterMedicineByMedicinalUse', requireAuth, filterMedicineByMedicinalUse);

router.post('/cancelOrder/:username/:orderId',requireAuth, cancelOrder);
//http://localhost:8000/api/patient/cancelOrder/exampleUser/123

router.delete('/removeCartItem/:patientUsername/:medicineName',requireAuth, removeCartItem);

router.get('/viewCartItems/:patientUsername', viewCartItems);
router.post('/viewDeliveryAddresses', viewDeliveryAdresses);
router.post('/viewItems', viewItems);

router.put('/addNewDeliveryAddress', AddNewDeliveryAdress);
router.put('/changeAmountOfAnItem', changeAmountOfAnItem);
router.post('/checkout', checkout);

router.post('/addMedicineToCart', addMedicineToCart);

router.post('/addMedicineToCart',requireAuth, addMedicineToCart);
router.get('/viewOrderDetails/:patientUsername/:orderId',requireAuth, viewOrderDetails);

module.exports = router //we need to export that router at the end so that App.js can access it