const express = require('express'); //require or import express
const {checkout, viewMedicineInventory, filterMedicineByMedicinalUse,
    AddNewDeliveryAdress, searchMedicineByName, cancelOrder, 
    removeCartItem, viewItems,changeAmountOfAnItem,viewCartItems,viewDeliveryAdresses,addMedicineToCart  } = 
    require('../Controllers/patientController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get('/viewMedicineInventory', viewMedicineInventory);

router.post('/searchMedicineByName', searchMedicineByName);

router.post('/filterMedicineByMedicinalUse', filterMedicineByMedicinalUse);

router.post('/cancelOrder/:username/:orderId', cancelOrder);
//http://localhost:8000/api/patient/cancelOrder/exampleUser/123

router.delete('/removeCartItem/:patientUsername/:medicineName', removeCartItem);

router.get('/viewCartItems/:patientUsername', viewCartItems);
router.post('/viewDeliveryAddresses', viewDeliveryAdresses);
router.post('/viewItems', viewItems);

router.put('/addNewDeliveryAddress', AddNewDeliveryAdress);
router.put('/changeAmountOfAnItem', changeAmountOfAnItem);
router.post('/checkout', checkout);

router.post('/addMedicineToCart', addMedicineToCart);


module.exports = router //we need to export that router at the end so that App.js can access it