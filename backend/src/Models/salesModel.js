// salesModel.js

const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
  },
  saleDate: {
    type: Date,
    required: true,
  },
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
