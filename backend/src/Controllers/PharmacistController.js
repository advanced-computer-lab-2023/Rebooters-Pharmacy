const Pharmacist = require('./Models/Pharmacist.js');

// Controller functions for Pharmacist
const pharmacistController = {
    // View the available quantity and sales of each medicine
    viewMedicineInventory: async (req, res) => {
      try {
        // Fetch all medicines (prescriptions in this context)
        const medicines = await Prescription.find();
        res.status(200).json(medicines);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching medicine inventory' });
      }
    },
  
    // Add a new medicine with details, price, and available quantity
    addMedicine: async (req, res) => {
      try {
        const { name, activeIngredients, price, quantity } = req.body;
        const newMedicine = new Prescription({
          patientName: name,
          doctorName: '', // You can leave this empty for now
          medication: activeIngredients,
          dosage: '', // You can leave this empty for now
          instructions: '', // You can leave this empty for now
          date: new Date(),
        });
        const savedMedicine = await newMedicine.save();
        res.status(201).json(savedMedicine);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding medicine' });
      }
    },
  
    // Edit medicine details and price
    editMedicine: async (req, res) => {
      try {
        const medicineId = req.params.id; // ID of the medicine (prescription) to edit
        const { name, activeIngredients, price } = req.body;
        const updatedMedicine = await Prescription.findByIdAndUpdate(
          medicineId,
          {
            patientName: name,
            medication: activeIngredients,
          },
          { new: true }
        );
        if (!updatedMedicine) {
          return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json(updatedMedicine);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error editing medicine' });
      }
    },
  };

  
module.exports = { pharmacistController }; 