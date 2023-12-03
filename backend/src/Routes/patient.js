const express = require('express'); //require or import express
const Medicine = require('../Models/medicineModel');
const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const { checkout, viewMedicineInventory, filterMedicineByMedicinalUse,
    AddNewDeliveryAdress, searchMedicineByName, cancelOrder, 
    removeCartItem, changeAmountOfAnItem,viewItems, 
    viewCartItems,viewDeliveryAdresses,addMedicineToCart, 
    viewOrderDetails, logout, changePassword , viewAllOrders, startNewChat, continueChat, viewMyChats, deleteChat, checkWalletBalance,viewMedicineAlternatives } = require('../Controllers/patientController') //we're destructuring so we need curly braces

const router = express.Router() //create a router
router.get('/logout', requireAuth, logout);

router.get('/viewAllOrders', requireAuth, viewAllOrders);

router.get('/checkWalletBalance', requireAuth, checkWalletBalance);

router.post('/changePassword', requireAuth, changePassword);

router.get('/viewMedicineInventory', requireAuth, async (req, res) => {
  try {
    // Fetch medicines with quantity greater than 0 and Archive is false
    const medicines = await Medicine.find({ quantity: { $gt: 0 }, Archive: false });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No available medicines found.' });
    }

    // Map the medicines to only include relevant information
    const medicinesInfo = medicines.map((medicine) => ({
      name: medicine.name,
      price: medicine.price,
      description: medicine.description,
      image: medicine.image,
      sales: medicine.sales,
      quantity: medicine.quantity,
      activeIngredients: medicine.activeIngredients,
      PrescriptionNeeded: medicine.PrescriptionNeeded,
      medicinalUse: medicine.medicinalUse,
      Archive: medicine.Archive,
    }));

    res.status(200).json(medicinesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching available medicine inventory' });
  }
});

router.post('/searchMedicineByName', requireAuth, async (req, res) => {
  try {
    const { medicineName } = req.body;

    if (!medicineName || medicineName.trim() === '') {
      return res.status(400).json({ message: 'Invalid medicine name query.' });
    }

    const query = {
      name: { $regex: new RegExp(`^${medicineName}$`, 'i') },
      Archive: false, // Filter by Archive = false
    };

    // For pharmacists and administrators, include archived medicines
    if (req.userRole === 'pharmacist' || req.userRole === 'administrator') {
      delete query.Archive;
    }

    const medicines = await Medicine.find(query);

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No matching medicines found.' });
    }

    // Map the matching medicines to only include relevant information
    const medicinesInfo = medicines.map((medicine) => ({
      name: medicine.name,
      price: medicine.price,
      description: medicine.description,
      activeIngredients: medicine.activeIngredients,
      image: medicine.image,
      quantity: medicine.quantity,
      medicinalUse: medicine.medicinalUse,
      PrescriptionNeeded: medicine.PrescriptionNeeded,
      image: medicine.image,
      Archive: medicine.Archive,
      sales: medicine.sales,
    }));

    // Check if the user is a patient and if any of the retrieved medicines are archived
    const isPatient = req.userRole === 'patient';
    const hasArchivedMedicine = medicinesInfo.some((medicine) => medicine.Archive);

    if (hasArchivedMedicine && isPatient) {
      return res.status(404).json({ message: 'Medicine is not available.' });
    }

    res.status(200).json(medicinesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for medicines by name' });
  }
});


router.post('/filterMedicineByMedicinalUse', requireAuth, async (req, res) => {
  try {
    const { medicinalUse } = req.body;

    if (!medicinalUse || medicinalUse.trim() === "") {
      return res.status(400).json({ message: "Invalid medicinal use." });
    }

    const query = {
      medicinalUse: { $regex: new RegExp(`^${medicinalUse}$`, 'i') },
      Archive: false,
    };

    // For pharmacists and administrators, include archived medicines
    if (req.userRole === 'pharmacist' || req.userRole === 'administrator') {
      delete query.Archive;
    }

    const medicines = await Medicine.find(query);

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No matching medicines found.' });
    }

    // Map the matching medicines to only include relevant information
    const medicinesInfo = medicines.map((medicine) => ({
      name: medicine.name,
      price: medicine.price,
      description: medicine.description,
      activeIngredients: medicine.activeIngredients,
      medicinalUse: medicine.medicinalUse,
      PrescriptionNeeded: medicine.PrescriptionNeeded,
      quantity: medicine.quantity,
      sales: medicine.sales,
      archived: medicine.Archive,
      image: medicine.image,
    }));

    res.status(200).json(medicinesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error filtering medicines by medicinal use" });
  }
});

router.post('/cancelOrder',requireAuth, cancelOrder);

router.delete('/removeCartItem', requireAuth, removeCartItem);

router.post('/viewCartItems', requireAuth, viewCartItems);
router.post('/viewDeliveryAddresses', requireAuth, viewDeliveryAdresses);
router.post('/viewItems', requireAuth, viewItems);

router.put('/addNewDeliveryAddress', requireAuth, AddNewDeliveryAdress);
router.put('/changeAmountOfAnItem', requireAuth, changeAmountOfAnItem);
router.post('/checkout', requireAuth, checkout);

router.post('/addMedicineToCart', requireAuth, addMedicineToCart);

router.post('/viewMedicineAlternatives',requireAuth, viewMedicineAlternatives);

router.post('/viewOrderDetails',requireAuth, viewOrderDetails);

router.post('/startNewChat',requireAuth, startNewChat);
router.get('/viewMyChats',requireAuth, viewMyChats);
router.post('/continueChat',requireAuth, continueChat);
router.delete('/deleteChat/:chatId', requireAuth, deleteChat);



module.exports = router //we need to export that router at the end so that App.js can access it