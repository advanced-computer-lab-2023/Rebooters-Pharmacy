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
  
  //static signup function
  // guestSchema.statics.signup = async function(username, password){ //add here any other attributes you need
  //   //validations
  //   if(!username || !password){
  //     throw Error('All fields must be filled')
  //   }
  //   if(!validator.isStrongPassword(password)){
  //     throw Error('Password is not strong enough')
  //   }
  //   const exists = await this.findOne({username})
  //   if(exists){
  //     throw Error('Username already in use')
  //   }
  //   const salt = await bcrypt.genSalt(10) //a value that gets added to the password for security
  //   const hash = await bcrypt.hash(password, salt) //a function that adds the salt value to the password and hashes both
    
  //   const guest = await this.create({username, password: hash})
  //   return guest
  // }
  
  //static login function
  // guestSchema.statics.login = async function(username, password){
  //   // validations
  //   if(!username || !password){
  //     throw Error('All fields must be filled')
  //   }
  //   const user = await this.findOne({username})
  //     if(!user){
  //       throw Error('Incorrect username')
  //     }
  //     const match = await bcrypt.compare(password, user.password)
  //     if(!match){
  //       throw Error('Incorrect password')
  //     }
  //     return user;
  // }
  const Guest = mongoose.model('Guest', guestSchema);
  module.exports = {Guest};
  