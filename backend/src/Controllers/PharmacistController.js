const Pharmacist = require('../Models/pharmacistModel');
const Medicine = require('../Models/medicineModel');
const Chat = require('../Models/chatModel');
//const upload = require ('./uploadMiddleware');
const {viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');
const {logout, changePassword} = require('./authController');
const {getOutOfStockMedicines} = require('./patientController');
const {checkWalletBalance} = require('./walletController');
const bcrypt = require('bcrypt'); //needed for when u create a dummy pharmacist for testing only
const { generateSalesReport } = require('./commonController');
const Sales= require('../Models/salesModel');


// Generate a random password (you can use a library like 'crypto' for this)
// const randomPassword = 'randompassword123'; // Replace with your random password generation logic

// // Hash the password
// bcrypt.hash(randomPassword, 10, async (err, hashedPassword) => {
//     if (err) {
//         console.error('Error hashing the password:', err);
//         return;
//     }

//     try {
//         // Create a new pharmacist document with the hashed password
//         const newPharmacist = new Pharmacist({
//             username: 'shahdsharaf',
//             name: 'Dummy Pharmacist Name',
//             email: 'shahdsharaf02@gmail.com',
//             password: hashedPassword,
//             dateOfBirth: new Date('1990-01-01'),
//             hourlyRate: 25, // Replace with the desired rate
//             affiliation: 'Dummy Affiliation',
//             educationalBackground: 'PharmD',
//         });

//         // Save the new pharmacist to the database
//         await newPharmacist.save();

//         console.log('Dummy pharmacist created successfully.');
//     } catch (error) {
//         console.error('Error creating the dummy pharmacist:', error);
//     }
// });
// Controller functions for Pharmacist


const filterSalesReport = async (req, res) => {
  try {
    const { medicineName, saleDate } = req.body;

    if (medicineName && saleDate) {

      const startOfDay = new Date(saleDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(saleDate);
      endOfDay.setHours(23, 59, 59, 999);

      let filterCriteria = await Sales.find({
        medicineName: { $regex: new RegExp(medicineName, "i") },
        saleDate: { $gte: startOfDay, $lte: endOfDay },
      }).exec();

      console.log("Filter Criteria:", filterCriteria);

      const result = filterCriteria.map((sale) => {
        return {
          medicineName: sale.medicineName,
          quantitySold: sale.quantitySold,
          saleDate: sale.saleDate,
        };
      });

      return res.status(200).json(result);
    } else if (!medicineName && saleDate) {

      const startOfDay = new Date(saleDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(saleDate);
      endOfDay.setHours(23, 59, 59, 999);

      let filterCriteria = await Sales.find({saleDate: { $gte: startOfDay, $lte: endOfDay }}).exec();

      const result = filterCriteria.map((sale) => {
        return {
          medicineName: sale.medicineName,
          quantitySold: sale.quantitySold,
          saleDate: sale.saleDate,
        };
      });

      return res.status(200).json(result);
    }
    else if (medicineName && !saleDate) {


      let filterCriteria = await Sales.find({
        medicineName: { $regex: new RegExp(medicineName, "i") } }).exec();

      const result = filterCriteria.map((sale) => {
        return {
          medicineName: sale.medicineName,
          quantitySold: sale.quantitySold,
          saleDate: sale.saleDate,
        };
      });

      return res.status(200).json(result);
    } 
    else {
      return res.status(400).json({
        error:
          "Please provide at least search parameters (medicineName or saleDate).",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while filtering sales.",
    });
  }
};




const addMedicine = async (req, res) => {
  try {
    const { name, activeIngredients, price, description, medicinalUse, quantity,sales,PrescriptionNeeded, Archive } = req.body;
    const newMedicine = new Medicine({ name, activeIngredients, price, description, medicinalUse, quantity,sales,PrescriptionNeeded });

    // Check if an image file was uploaded
    if (req.file) {
      newMedicine.image.data = req.file.buffer;
      newMedicine.image.contentType = req.file.mimetype;
      newMedicine.image.filename = req.file.originalname;
    }

    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding medicine' });
  }
};
   
    // Add a new medicine with details, price, and available quantity
    
  
const viewMedicineInventoryPharmacist = async (req, res) => {
  try {
    // Fetch medicines with quantity greater than 0
    const medicines = await Medicine.find({ quantity: { $gt: 0 } });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No available medicines found.' });
    }

    // Map the medicines to only include relevant information
    const medicinesInfo = medicines.map((medicine) => ({
      name: medicine.name,
      quantity: medicine.quantity,
      sales: medicine.sales
    }));

    res.status(200).json(medicinesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching available medicine inventory' });
  }
};



    // Edit medicine details and price
const editMedicine = async (req, res) => {
      try {
        
        const { name, activeIngredients, price ,medicinalUse,description,quantity , PrescriptionNeeded, Archive} = req.body;
        const updatedMedicine = await Medicine.findOneAndUpdate(
          { name: name },
          { activeIngredients, price, medicinalUse, description, quantity , PrescriptionNeeded, Archive},
          { new: true }
        );
        if (!updatedMedicine) {
          return res.status(404).json({ message: 'Medicine not found' });
        }
        if (req.file) {
          updatedMedicine.image.data = req.file.buffer;
          updatedMedicine.image.contentType = req.file.mimetype;
          updatedMedicine.image.filename = req.file.originalname;
        }
    
        await updatedMedicine.save();
        res.status(200).json(updatedMedicine);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error editing medicine' });
      }
    };
    const viewAllChats = async (req, res) => {
      try {
        const pharmacistUsername = req.cookies.username; // Get the pharmacist's username from the cookies
    
        // Find all chats where the pharmacist is either an empty string or matches the pharmacist's username
        const chats = await Chat.find({
          $or: [
            { pharmacist: '' },
            { pharmacist: pharmacistUsername },
          ],
        });
    
        if (!chats || chats.length === 0) {
          return res.status(404).json({ message: 'No chats found.' });
        }
    
        res.status(200).json(chats);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching chats' });
      }
    };

    const sendMessageToChat = async (req, res) => {
      try {
        const pharmacistUsername = req.cookies.username; // Get the pharmacist's username from the cookies
        const { chatId, messageContent } = req.body;
    
        // Find the chat based on the provided chat ID
        const chat = await Chat.findById(chatId);
    
        if (!chat) {
          return res.status(404).json({ message: 'Chat not found' });
        }
    
        // Check if the pharmacist can send a message to this chat
        if (chat.pharmacist !== '' && chat.pharmacist !== pharmacistUsername) {
          return res.status(403).json({ message: 'Unauthorized to send a message to this chat' });
        }
    
        // If the pharmacist attribute is an empty string, set it to the pharmacist's username
        if (chat.pharmacist === '') {
          chat.pharmacist = pharmacistUsername;
        }
    
        // Add the pharmacist's message to the messages array in the chat
        chat.messages.push({
          username: pharmacistUsername,
          userType: 'pharmacist',
          content: messageContent,
        });
    
        // Save the updated chat to the database
        const updatedChat = await chat.save();
    
        res.status(200).json(updatedChat);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message to chat' });
      }
    };
    
    module.exports = {
      generateSalesReport,
      filterSalesReport,

      viewMedicineInventoryPharmacist,
      addMedicine,
      filterMedicineByMedicinalUse,
      viewMedicineInventory,
      searchMedicineByName,
      editMedicine,
      logout,
      changePassword,
      viewAllChats,
      sendMessageToChat,
      getOutOfStockMedicines,
      checkWalletBalance,
    };
    

    