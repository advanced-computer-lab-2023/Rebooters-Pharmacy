const Patient = require('../Models/patientModel');
const Medicine = require('../Models/medicineModel');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');

module.exports = {  viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName }; 