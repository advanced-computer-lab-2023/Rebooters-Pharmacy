
const Patient = require('../Models/patientModel');
const Medicine = require('../Models/medicineModel');
const Order= require ('../Models/orderModel');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');
const {logout, changePassword} = require('./authController');

// const dummyOrder3 = new Order({
//   patient: '651ff56acf374b1cacaa2cc3',
//   patientUsername:'maya', 
//   patientMobileNumber: '3232323', 
//   paymentMethod: 'Visa',
//   status: 'Processing', 
//   total: 80,
//   items: [
//     {
//       medicine: '6523f85bbdd733cb0b368cc2',
//       name:'paracetamol',
//       price: 40,
//       quantity: 2,
//     }], 
// });
// dummyOrder3.save();

const viewCartItems = async (req, res) => {
  try {
    const username = req.cookies.username;
    const patient = await Patient.findOne({ username });

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



const removeCartItem = async (req, res) => {
  try {
    const username = req.cookies.username; // Retrieve the username from the cookie   
    const { medicineName } = req.body; // Get the medicine name from the request body

    const patient = await Patient.findOne({ username:username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find the index of the item in the patient's cart with the matching medicine name
    const itemIndex = patient.cart.findIndex((item) => item.name === medicineName);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Medicine not found in the cart' });
    }

    // Remove the item with the matching medicine name from the patient's cart
    patient.cart.splice(itemIndex, 1);

    // Save the updated patient information to the database
    await patient.save();

    res.status(200).json({ message: 'Medicine removed from the cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing medicine from the cart' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Get the patient's username from the request
    const orderId = req.body.orderId; // Get the order _id from the request

    // Find the order with the given orderId
    const order = await Order.findOne({ _id: orderId, patientUsername: patientUsername });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is currently in 'Pending' status
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order cannot be canceled as it is not in Pending status' });
    }

    // Update the order status to 'Canceled'
    order.status = 'Canceled';

    // Save the updated order information to the database
    await order.save();

    res.status(200).json({ message: 'Order canceled successfully', updatedOrder: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error canceling order' });
  }
};

const viewDeliveryAdresses = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({username:patientUsername});
    if (!patient ) {
      return res.status(404).json({ message: 'No available delivery Adresses found.' });
    }
    res.status(200).json(patient.deliveryAddresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching delivery addresses' });
  }
};
const AddNewDeliveryAdress = async (req, res) => {
  try{
  const patientUsername = req.cookies.username;
  const patient = await Patient.findOne({username:patientUsername});
 
  const deliveryAddresses=patient.deliveryAddresses
 
  var arrayOfAddresses = req.body.deliveryAddress.split("%");
  for(let i=0;i<arrayOfAddresses.length-1;i++){
        deliveryAddresses.push(arrayOfAddresses[i])
      
  }
  
        const updatePatient = await Patient.findOneAndUpdate(
          { username: patientUsername },
          { deliveryAddresses},
          { new: true }
        );
        if (!updatePatient) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(updatePatient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding new Address' });
      }
};
const changeAmountOfAnItem = async (req, res) => {
  try{
  const patientUsername =  req.cookies.username;
  const patient = await Patient.findOne({username:patientUsername});
  const cart=patient.cart;
  let index=cart.findIndex(item => item.name === req.query.name)
  cart[index].quantity=req.query.quantity
  const updateItems = await Patient.findOneAndUpdate(
    { username: patientUsername },
    { cart},
    { new: true }
  );
  if (!updateItems) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.status(200).json(updateItems);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Error updating quantity of an item' });
}
};

const addMedicineToCart = async (req, res) => {
  try {
    const username = req.cookies.username; // Get the patient's username from the request

    const patient = await Patient.findOne({ username: username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const name = req.body.medicineName; // Assuming you receive the OTC medicine's name in the request body

    const medicine = await Medicine.findOne({ name: name });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if the medicine is OTC (over the counter)
    if (!medicine.PrescriptionNeeded) {
      // Create a cart item with the medicine's details
      const cartItem = {
        medicine: medicine._id, // Store the medicine's ID
        name: medicine.name,
        price: medicine.price,
        quantity: 1, // You can set an initial quantity
      };

      // Add the cart item to the patient's cart
      patient.cart.push(cartItem);

      // Save the updated patient information to the database
      await patient.save();

      res.status(200).json({ message: 'Medicine added to the cart' });
    } else {
      res.status(400).json({ message: 'Prescription is needed for this medicine' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding medicine to the cart' });
  }
};


const viewItems = async (req, res) => {
  try {
    const patientUsername = req.query.patientUsername; // Get the patient's username from the request
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
// const checkout = async (req, res) => {
//   try {
//     const orderDate = new Date();
//     const patientUsername= req.cookies.username;
//     const givenPatient = await Patient.findOne({ username: patientUsername });
//     const patient=givenPatient._id;  
//     const status="Pending";
//     const { address,items,patientMobileNumber,paymentMethod,total } = req.body;
//     for(let i=0;i<items.length;i++){
//     const givenMedicine = await Medicine.findOne({ name:items[i].name });
//     items[i].medicine=givenMedicine._id
//     }
//     const newOrder = new Order({ total,paymentMethod,address,items,orderDate,
//       patientMobileNumber,patientUsername,status,patient });
//     const savedOrder = await newOrder.save();
//     let cart=[];
//     const updatePatient = await Patient.findOneAndUpdate(
//       { username: patientUsername },
//       { cart},
//       { new: true }
//     );
    
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error checkout' });
//   }
// };
const checkout = async (req, res) => {
let total = 0;
  try {
    const orderDate = new Date();
    const patientUsername = req.cookies.username;
    const givenPatient = await Patient.findOne({ username: patientUsername });

    if (!givenPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const patientId = givenPatient._id;
    const status = 'Pending';
    const { address, items, patientMobileNumber, paymentMethod } = req.body;

    // Create an array of item objects for the order
    const orderItems = [];
    for (let i = 0; i < items.length; i++) {
      const givenMedicine = await Medicine.findOne({ name: items[i].name });
      orderItems.push({
        medicine: givenMedicine._id,
        name: items[i].name,
        price: items[i].price,
        quantity: items[i].quantity,
      });
      total+=items[i].price;
    }

    // Create a new order using the Order schema
    const newOrder = new Order({
      total,
      paymentMethod,
      address,
      items: orderItems,
      orderDate,
      patientMobileNumber,
      patientUsername,
      status,
      patient: patientId,
    });

    // Save the new order
    const savedOrder = await newOrder.save();

    // Update the patient's orders array with the new order
    givenPatient.orders.push(savedOrder._id);
    await givenPatient.save();

    // Clear the patient's cart
    givenPatient.cart = [];
    await givenPatient.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking out' });
  }
};
const viewOrderDetails = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Get the patient's username from the request
    const orderId = req.body.orderId; // Get the order _id from the request

    // Find the order with the given orderId
    const order = await Order.findOne({ _id: orderId, patientUsername: patientUsername });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Construct a response object with the order details
    const orderDetails = {
      orderDate: order.orderDate,
      status: order.status,
      total: order.total,
      items: order.items,
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error viewing order details' });
  }
};

const viewAllOrders = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Get the patient's username from the request

    // Find the order with the given orderId
    const orders = await Order.find({ patientUsername: patientUsername });
    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error viewing orders' });
  }
};




module.exports = {  checkout, viewItems, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName, 
  viewCartItems, removeCartItem, cancelOrder,changeAmountOfAnItem,viewDeliveryAdresses,AddNewDeliveryAdress ,addMedicineToCart, viewOrderDetails, logout, changePassword, viewAllOrders}; 
