
const Patient = require('../Models/patientModel');
const Medicine = require('../Models/medicineModel');
const Order= require ('../Models/orderModel');
const Chat = require('../Models/chatModel');
const nodemailer = require('nodemailer');
const Sales= require('../Models/salesModel');
const Pharmacist = require('../Models/pharmacistModel');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');
const {logout, changePassword} = require('./authController');
const {checkWalletBalance} = require('./walletController');
const outOfStockMedicines = []; 
const mongoose = require('mongoose');

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
const getPatientProfile = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Assuming the username is stored in cookies

    // Fetch patient data based on the username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const emergencyContactArray = patient.emergency_contact
      ? [
          {
            firstName: patient.emergency_contact.firstName,
            lastName: patient.emergency_contact.lastName,
            mobile: patient.emergency_contact.mobile_number,
          },
        ]
      : [];

    // Return relevant patient data
    const patientData = {
      username: patient.username,
      name: patient.name,
      email: patient.email,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      mobileNumber: patient.mobile_number,
      emergencyContact: emergencyContactArray,
      deliveryAddresses: patient.deliveryAddresses,
      selectedDoctors: patient.selectedDoctors,
      healthPackage: patient.healthPackage,
      familyMembers: patient.familyMembers,
      cart: patient.cart,
      orders: patient.orders,
      wallet: patient.wallet,
      medicalHistory: patient.medicalHistory,
      healthRecords: patient.healthRecords,
      statusOfHealthPackage: patient.statusOfHealthPackage,
      healthPackageCreatedAt: patient.healthPackageCreatedAt,
      OTP: patient.OTP,
      // Add more fields as needed
    };

    res.status(200).json(patientData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patient profile' });
  }
};

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
    const patientUsername = req.cookies.username;
    const orderId = req.body.orderId;

    const order = await Order.findOne({ _id: orderId }).populate('items.medicine');
    const givenPatient = await Patient.findOne({ username: patientUsername });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order cannot be canceled as it is not in Pending status' });
    }

    if (order.paymentMethod !== 'cash on delivery') {
      givenPatient.wallet += order.total;
      await givenPatient.save();
    }

    order.status = 'Canceled';
    await order.save();

    for (const item of order.items) {
      const medicine = item.medicine;

      if (medicine) {
        // Update the quantity and sales in the Medicine schema
        medicine.quantity += item.quantity;
        medicine.sales -= item.quantity;

        // Save the updated medicine object
        await medicine.save();
      }
    }

    // Remove sales related to the canceled order
    await Sales.deleteMany({ order: order._id });

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
    const username = req.cookies.username;
    const patient = await Patient.findOne({ username: username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const Medicinename = req.body.name;
    const medicine = await Medicine.findOne({ name: Medicinename });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (!medicine.PrescriptionNeeded) {
      // OTC medicine
      const cartItem = {
        medicine: medicine._id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        image: {
          data: medicine.image.data,
          contentType: medicine.image.contentType,
          filename: medicine.image.filename,
        },
        
      };
      patient.cart.push(cartItem);
      await patient.save();
      return res.status(200).json({ message: 'Medicine added to the cart' });
    }

    // Prescription needed
    const recentPrescription = await mongoose.connection.db.collection('prescriptions').findOne({
      patientName: patient.username,
      'medicationInfo.medicine': medicine.name,
      date: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) } // Within the last week
    });

    if (recentPrescription) {
      const cartItem = {
        medicine: medicine._id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        image: {
          data: medicine.image.data,
          contentType: medicine.image.contentType,
          filename: medicine.image.filename,
        },
      };
      patient.cart.push(cartItem);
      await patient.save();
      return res.status(200).json({ message: 'Medicine added to the cart' });
    } else {
      return res.status(200).json({ message: 'Prescription is needed for this medicine or the prescription is not recent' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding medicine to the cart', error: error.message });
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
const sendNotificationByEmail = async (email, message) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls:{
        rejectUnauthorized: false,
      }
    });

    // Send notification emails to users
    let info = await transporter.sendMail({
      from: "Rebooters",
      to: email,
      subject: "Out of Stock Notification",
      html: `<h1>Out of Stock Notification</h1>
      <p>${message}</p>`,
    });

    console.log("Notification Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

const checkout = async (req, res) => {
  let total = 0;
  //let outOfStockMedicines = [];

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
      if (givenMedicine.quantity < items[i].quantity) {
        return res.status(400).json({ message: `Not enough stock for ${givenMedicine.name}` });
      }

      // Adjust total based on the quantity of each medicine
      total += items[i].price * items[i].quantity;

      orderItems.push({
        medicine: givenMedicine._id,
        name: items[i].name,
        price: items[i].price,
        quantity: items[i].quantity,
      });

      // Check if the quantity becomes 0 and add to outOfStockMedicines
      // if (givenMedicine.quantity === 0) {
      //   outOfStockMedicines.push(givenMedicine.name);
      // }
      // await givenMedicine.save();
    }

    // Check wallet balance if the paymentMethod is 'wallet'
    if (paymentMethod === 'wallet') {
      const walletBalance = givenPatient.wallet === undefined ? 0 : givenPatient.wallet;
      if (walletBalance < total) {
        return res.status(404).json({ message: 'Not enough money in the wallet' });
      }
    }


    for (let i = 0; i < items.length; i++) {
      const givenMedicine = await Medicine.findOne({ name: items[i].name });
      givenMedicine.quantity -= items[i].quantity;
      givenMedicine.sales += items[i].quantity;

      if (givenMedicine.quantity === 0) {
        outOfStockMedicines.push(givenMedicine.name);
      }
      await givenMedicine.save();

      const salesEntry = new Sales({
        medicineName: givenMedicine.name,
        quantitySold: items[i].quantity,
        saleDate: orderDate,
      });
      await salesEntry.save();
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

    // Clear the patient's cart
    givenPatient.cart = [];

    // Deduct the amount from the wallet if paymentMethod is 'wallet'
    if (paymentMethod === 'wallet') {
      givenPatient.wallet -= total;
    }

    // Save the updated patient data
    await givenPatient.save();

    // Send notification email for out of stock medicines
    if (outOfStockMedicines.length > 0) {
      const notificationMessage = `The following medicines are out of stock: ${outOfStockMedicines.join(', ')}`;
      const pharmacistEmails = await Pharmacist.find().distinct('email');
      pharmacistEmails.forEach(async (pharmacistEmail) => {
        await sendNotificationByEmail(pharmacistEmail, notificationMessage);
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking out' });
  }
};


const getOutOfStockMedicines = (req, res) => {
  try {
    // Return the global outOfStockMedicines array
    res.status(200).json({ outOfStockMedicines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving out-of-stock medicines' });
  }
};

const removeNotification = (medicineName) => {
  const index = outOfStockMedicines.indexOf(medicineName);
  if (index !== -1) {
    outOfStockMedicines.splice(index, 1);
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
      paymentMethod: order.paymentMethod,
      total: order.total,
      items: order.items,
       image: order.image
        ? {
            data: order.image.data,
            contentType: order.image.contentType,
            filename: order.image.filename,
          }
        : null,
    
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

const startNewChat = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { messageContent } = req.body;

    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newChat = new Chat({
      patient: patientUsername,
      pharmacist: '',
      messages: [
        {
          username: patientUsername,
          userType: 'patient',
          content: messageContent,
        },
      ],
    });

    const savedChat = await newChat.save();
    // Update the patient's chats array with the new chat ID
    await patient.save();

    res.status(201).json(savedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error starting a new chat' });
  }
};

const continueChat = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { chatId, messageContent } = req.body;

    // Find the patient using the username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find the chat using the provided chat ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the patient is the owner of the chat
    if (chat.patient !== patientUsername) {
      return res.status(403).json({ message: 'Unauthorized to continue this chat' });
    }

    // Add the patient's message to the messages array in the chat
    chat.messages.push({
      username: patientUsername,
      userType: 'patient',
      content: messageContent,
    });

    // Save the updated chat to the database
    const updatedChat = await chat.save();

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error continuing the chat' });
  }
};

const viewMyChats = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;

    // Find all chats where the patient is the same as the logged-in patient's username
    const chats = await Chat.find({ patient: patientUsername });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: 'No chats found.' });
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat based on the provided chat ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Delete the chat from the database
    await chat.deleteOne();

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting chat' });
  }
};

const viewMedicineAlternatives = async (req, res) => {
  try {
    const username = req.cookies.username;

    const patient = await Patient.findOne({ username: username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const name = req.body.name; 

    const medicine = await Medicine.findOne({ name: name });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (medicine.quantity === 0) {
      // Quantity is 0, find alternatives based on main active ingredient
      const alternatives = await Medicine.find({
        activeIngredients: medicine.activeIngredients,
        quantity: { $gt: 0 }, // Find medicines with quantity greater than 0
      });

      if (alternatives.length > 0) {
        const alternativeDetails = alternatives.map(alternative => {
          return {
            name: alternative.name,
            activeIngredients: alternative.activeIngredients,
            price: alternative.price,
            description: alternative.description,
            medicinalUse: alternative.medicinalUse,
            PrescriptionNeeded: alternative.PrescriptionNeeded,
            image: alternative.image,
            quantity: alternative.quantity,
          };
        });
        return res.status(200).json({ message: 'No stock available, alternatives suggested', alternatives: alternativeDetails });
      } else {
        return res.status(200).json({ message: 'No alternatives available' });
      }
    } else {
      // Quantity is not 0, indicate that the medicine is not out of stock
      return res.status(200).json({ message: 'Medicine is not out of stock' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error viewing alternative medicine ' });
  }
};

module.exports = {  getPatientProfile,checkout, viewItems, viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName, checkWalletBalance,
  viewCartItems, removeCartItem, cancelOrder,changeAmountOfAnItem,viewDeliveryAdresses,AddNewDeliveryAdress ,addMedicineToCart, viewOrderDetails, logout, changePassword, viewAllOrders, 
startNewChat, continueChat, viewMyChats, deleteChat, getOutOfStockMedicines,viewMedicineAlternatives,removeNotification}; 
