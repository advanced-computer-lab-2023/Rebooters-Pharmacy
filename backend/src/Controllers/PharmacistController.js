const Pharmacist = require('../Models/pharmacistModel');
const Medicine = require('../Models/medicineModel');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');
// Controller functions for Pharmacist
const addMedicine = async (req, res) => {
  try {
    const { name, activeIngredients, price, quantity, description, medicinalUse } = req.body;
    const newMedicine = new Medicine({name, activeIngredients, price, quantity, description, medicinalUse});
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding medicine' });
  }
};
   
    // Add a new medicine with details, price, and available quantity
    
  
    // Edit medicine details and price
// const editMedicine = async (req, res) => {
//       try {
//         const medicineId = req.params.id; // ID of the medicine (prescription) to edit
//         const { name, activeIngredients, price } = req.body;
//         const updatedMedicine = await Prescription.findByIdAndUpdate(
//           medicineId,
//           {
//             patientName: name,
//             medication: activeIngredients,
//           },
//           { new: true }
//         );
//         if (!updatedMedicine) {
//           return res.status(404).json({ message: 'Medicine not found' });
//         }
//         res.status(200).json(updatedMedicine);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error editing medicine' });
//       }
//     };

  
module.exports = { addMedicine, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName }; 