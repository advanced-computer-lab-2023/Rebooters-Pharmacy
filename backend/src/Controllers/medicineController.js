
const Medicine = require('../Models/medicineModel');

const viewMedicineInventory = async (req, res) => {
    try {
      // Fetch medicines with quantity greater than 0
      const medicines = await Medicine.find({ quantity: { $gt: 0 } });
  
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
        quantity: medicine.quantity // You can include the image data if it's stored in your database
      }));
  
      res.status(200).json(medicinesInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching available medicine inventory' });
    }
  };
  const searchMedicineByName = async (req, res) => {
    try {
      const { medicineName } = req.body; // Assuming the medicine name is provided as a query parameter
  
      if (!medicineName || medicineName.trim() === '') {
        return res.status(400).json({ message: 'Invalid medicine name query.' });
      }

     // Perform an exact, case-insensitive match on the medicine name
     const medicines = await Medicine.find({ name: { $regex: new RegExp(`^${medicineName}$`, 'i') } });

      if (!medicines || medicines.length === 0) {
        return res.status(404).json({ message: 'No matching medicines found.' });
      }
  
      // Map the matching medicines to only include relevant information
      const medicinesInfo = medicines.map((medicine) => ({
        name: medicine.name,
        price: medicine.price,
        description: medicine.description,
        image: medicine.image, // You can include the image data if it's stored in your database
      }));
  
      res.status(200).json(medicinesInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error searching for medicines by name' });
    }
  };
  

const filterMedicineByMedicinalUse = async (req, res) => {
  try {
    const { medicinalUse } = req.body; // Assuming medicinal use is provided as a query parameter

    if (!medicinalUse || medicinalUse.trim() === '') {
      return res.status(400).json({ message: 'Invalid medicinal use query.' });
    }

    // Use a case-insensitive regular expression to find medicines with matching medicinal use
    const medicines = await Medicine.find({ medicinalUse: { $regex: new RegExp(`^${medicinalUse}$`, 'i') } });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No matching medicines found.' });
    }

    // Map the matching medicines to only include relevant information
    const medicinesInfo = medicines.map((medicine) => ({
      name: medicine.name,
      price: medicine.price,
      description: medicine.description,
      image: medicine.image, // You can include the image data if it's stored in your database
    }));

    res.status(200).json(medicinesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error filtering medicines by medicinal use' });
  }
};



  
  
     

  module.exports = { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName };