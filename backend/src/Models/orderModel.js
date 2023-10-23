const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: true,
  },
  patientUsername: {
    type: String,
    required: true,
  },
  patientMobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String, // You can specify the address field as needed
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine', // Reference to the Medicine model
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
