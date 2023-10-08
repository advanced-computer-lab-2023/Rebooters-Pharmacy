const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    activeIngredients: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    medicinalUse: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required : true,
    },
    image: {
        data: Buffer, // You can use Buffer to store binary image data
        contentType: String, // Store the content type (e.g., 'image/jpeg', 'image/png')
        filename: String, // Store the filename (optional)
      },
   
  }, { timestamps: true });

const Medicine = mongoose.model('Medicine', MedicineSchema);
module.exports = Medicine; 