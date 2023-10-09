const mongoose = require('mongoose');
const Schema = mongoose.Schema;

   

const emergencyContactSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
  });
  
  const guestSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: emergencyContactSchema,
      required: true,
    },
  });
  
  const Guest = mongoose.model('Guest', guestSchema);
  
  module.exports = {
 
     Guest
  };
  