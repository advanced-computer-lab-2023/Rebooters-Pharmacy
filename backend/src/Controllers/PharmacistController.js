const Pharmacist = require('../Models/pharmacistModel');
const Medicine = require('../Models/medicineModel');
//const upload = require ('./uploadMiddleware');
const {viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');
const {logout, changePassword} = require('./authController');
const bcrypt = require('bcrypt'); //needed for when u create a dummy pharmacist for testing only

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
const addMedicine = async (req, res) => {
  try {
    const { name, activeIngredients, price, description, medicinalUse, quantity,sales,PrescriptionNeeded } = req.body;
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
        
        const { name, activeIngredients, price ,medicinalUse,description,quantity , PrescriptionNeeded} = req.body;
        const updatedMedicine = await Medicine.findOneAndUpdate(
          { name: name },
          { activeIngredients, price, medicinalUse, description, quantity , PrescriptionNeeded},
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
  
module.exports = { viewMedicineInventoryPharmacist, addMedicine, filterMedicineByMedicinalUse, viewMedicineInventory, searchMedicineByName,editMedicine, logout, changePassword }; 