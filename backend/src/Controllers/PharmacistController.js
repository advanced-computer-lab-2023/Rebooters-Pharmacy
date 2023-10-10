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
    
  
const viewMedicineInventoryPharmacist = async (req, res) => {
  try {
    // Fetch medicines with quantity greater than 0
    const medicines = await Medicine.find({ quantity: { $gt: 0 } });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No available medicines found.' });
    }

    // Map the medicines to only include relevant information
    const medicinesInfo = medicines.map((medicine) => ({
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
        const id = req.params.id; // ID of the medicine (prescription) to edit
        const { name, activeIngredients, price ,medicinalUse,description,quantity} = req.body;
        const updatedMedicine = await Medicine.findOneAndUpdate({
          _id:id
        },{...req.body},{ new: true })
        if (!updatedMedicine) {
          return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json(updatedMedicine);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error editing medicine' });
      }
    };
// const dummyPharmacist = new Pharmacist({
//   username: 'dummypharmacist',
//   password: 'dummypharmacistpassword',
//   name: 'Dummy pharmacist',
//   email: 'dummypharmacist@example.com',
//   dateOfBirth: new Date('1990-01-01'), // Assuming the date of birth is stored as a Date
//   hourlyRate: 100.0, // Example hourly rate
//   affiliation: 'Hospital ABC',
//   speciality: 'Cardiology',
//   educationalBackground: 'pharma School XYZ graduate',
  
// });

// dummyPharmacist.save(); 

  
module.exports = { viewMedicineInventoryPharmacist, addMedicine, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName,editMedicine }; 