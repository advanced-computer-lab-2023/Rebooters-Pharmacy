const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  patient: {
     type: String, 
     required: true,
     },
  pharmacist: { 
     type: String, 
     default: "",
    },
  messages: [
    {
      username: String,
      userType: { type: String, enum: ['patient', 'pharmacist'] },
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
