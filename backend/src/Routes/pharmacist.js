const express = require('express') //require or import express
const {addMedicine} = require('../Controllers/PharmacistController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.post('/addMedicine' , addMedicine);


module.exports = router //we need to export that router at the end so that App.js can access it