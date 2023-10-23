const Patient = require('../Models/patientModel');
const Medicine = require('../Models/medicineModel');
const Order= require ('../Models/orderModel');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');

const viewCartItems = async (req, res) => {
  try {
    const patientUsername = req.params.patientUsername; // Get the patient's username from the request

    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const cartItems = patient.cart; // Access the cart property

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error viewing cart items' });
  }
};

// Add a route to remove an item from the cart
const removeCartItem = async (req, res) => {
  try {
    // Get the patient username from the request parameters
    const patientUsername = req.params.patientUsername;

    // Get the medicine name from the request parameters
    const medicineName = req.params.medicineName; 
    
    // Find the patient with the matching username in the database
    const patient = await Patient.findOne({ username: patientUsername });

    // Check if the patient exists
    if (!patient) {
      // Return a 404 response if the patient is not found
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find the index of the item in the patient's cart with the matching medicine name
    const itemIndex = patient.cart.findIndex((item) => item.name === medicineName);

    // Check if the medicine item is not found in the patient's cart
    if (itemIndex === -1) {
      // Return a 404 response if the medicine is not found in the cart
      return res.status(404).json({ message: 'Medicine not found in the cart' });
    }

    // Remove the item with the matching medicine name from the patient's cart
    patient.cart.splice(itemIndex, 1);

    // Save the updated patient information to the database
    await patient.save();

    // Return a 200 response to indicate successful removal of the medicine from the cart
    res.status(200).json({ message: 'Medicine removed from the cart' });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: 'Error removing medicine from the cart' });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const username = req.params.username; // Assuming you can get the username from the request
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.patientUsername !== username) {
      return res.status(403).json({ message: 'Permission denied. This order does not belong to the patient.' });
    }

    // Update the order status to "Cancelled"
    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order canceled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error canceling the order' });
  }
};

module.exports = {  viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName, 
  viewCartItems, removeCartItem, cancelOrder }; 