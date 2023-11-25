const express = require('express'); //require or import express

const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const { checkout, viewMedicineInventory, filterMedicineByMedicinalUse,
    AddNewDeliveryAdress, searchMedicineByName, cancelOrder, 
    removeCartItem, changeAmountOfAnItem,viewItems, 
    viewCartItems,viewDeliveryAdresses,addMedicineToCart, 
    viewOrderDetails, logout, changePassword , viewAllOrders, startNewChat, continueChat, viewMyChats, deleteChat } = require('../Controllers/patientController') //we're destructuring so we need curly braces

const router = express.Router() //create a router
router.get('/logout', requireAuth, logout);

router.get('/viewAllOrders', requireAuth, viewAllOrders);

router.post('/changePassword', requireAuth, changePassword);

router.get('/viewMedicineInventory', requireAuth, viewMedicineInventory);

router.post('/searchMedicineByName', requireAuth, searchMedicineByName);

router.post('/filterMedicineByMedicinalUse', requireAuth, filterMedicineByMedicinalUse);

router.post('/cancelOrder',requireAuth, cancelOrder);

router.delete('/removeCartItem', requireAuth, removeCartItem);

router.post('/viewCartItems', requireAuth, viewCartItems);
router.post('/viewDeliveryAddresses', requireAuth, viewDeliveryAdresses);
router.post('/viewItems', requireAuth, viewItems);

router.put('/addNewDeliveryAddress', requireAuth, AddNewDeliveryAdress);
router.put('/changeAmountOfAnItem', requireAuth, changeAmountOfAnItem);
router.post('/checkout', requireAuth, checkout);

router.post('/addMedicineToCart', requireAuth, addMedicineToCart);

router.post('/addMedicineToCart',requireAuth, addMedicineToCart);
router.post('/viewOrderDetails',requireAuth, viewOrderDetails);

router.post('/startNewChat',requireAuth, startNewChat);
router.get('/viewMyChats',requireAuth, viewMyChats);
router.post('/continueChat',requireAuth, continueChat);
router.delete('/deleteChat/:chatId', requireAuth, deleteChat);
module.exports = router //we need to export that router at the end so that App.js can access it