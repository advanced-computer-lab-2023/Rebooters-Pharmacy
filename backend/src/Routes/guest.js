const express = require('express') //require or import express
const {createPatient, createNewPharmacistRequest} = require('../Controllers/guestController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.post('/createPatient' , createPatient);

router.post('/createNewPharmacistRequest' , createNewPharmacistRequest);

module.exports = router //we need to export that router at the end so that App.js can access it