const Administrator = require('../Models/administratorModel');
const Sales= require('../Models/salesModel');

const Pharmacist = require('../Models/pharmacistModel');
const Patient = require('../Models/patientModel');
const NewPharmacistRequest = require('../Models/newPharmacistRequestModel');
const bcrypt = require('bcrypt');
const { viewMedicineInventory, filterMedicineByMedicinalUse, searchMedicineByName } = require('./medicineController');
const {logout, changePassword, createToken} = require('./authController');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { generateSalesReport } = require('./commonController');

require("dotenv").config();

const getAdminProfile = async (req, res) => {
  try {
    const adminUsername = req.cookies.username; // Assuming the username is stored in cookies

    // Fetch admin data based on the username
    const admin = await Administrator.findOne({ username: adminUsername });

    if (!admin) {
      return res.status(404).json({ message: 'Administrator not found' });
    }

    // Return relevant admin data
    const adminData = {
      username: admin.username,
      email: admin.email,
      // Add more fields as needed
    };

    res.status(200).json(adminData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching administrator profile' });
  }
};
const addAdministrator= async (req, res) => {
      try {
        const { username, password,email } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdministrator = new Administrator({ username, password:hashedPassword ,email});
        const savedAdministrator = await newAdministrator.save();
        const token = createToken(savedAdministrator._id);
        res.status(201).json({ username, token, savedAdministrator });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding administrator' });
      }
}
  

const removeUserFromSystem = async (req, res) => {
  try {
    const { username } = req.body;
    const removedPharmacist = await Pharmacist.findOneAndDelete({ username });
    if (!removedPharmacist) {
      const removedPatient = await Patient.findOneAndDelete({ username });
      if (!removedPatient) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing user from the system' });
  }
};



    // View all information uploaded by a pharmacist to apply to join the platform
const viewPharmacistApplication = async (req, res) => {
      try {
        // Fetch all pharmacist application data (customize this based on your data structure)
        const pharmacistApplications = await NewPharmacistRequest.find({ status: 'pending' });
        res.status(200).json(pharmacistApplications);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pharmacist applications' });
      }
};



    // View a pharmacist's information
    const viewPharmacistInformation = async (req, res) => {
      try {
        const { pharmacistUsername, startsWithLetter } = req.body;
    
        let query = { username: new RegExp(`^${startsWithLetter}`, 'i') };
    
        if (pharmacistUsername) {
          // If specific username is provided, include it in the query
          query = { ...query, username: new RegExp(`^${pharmacistUsername}`, 'i') };
        }
    
        const pharmacists = await Pharmacist.find(query);
        res.status(200).json(pharmacists);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pharmacist information' });
      }
    }
    
  
    // View a patient's basic information
    const viewPatientInformation = async (req, res) => {
      try {
        const { patientUsername, startsWithLetter } = req.body;
    
        let query = { username: new RegExp(`^${startsWithLetter}`, 'i') };
    
        if (patientUsername) {
          // If specific username is provided, include it in the query
          query = { ...query, username: new RegExp(`^${patientUsername}`, 'i') };
        }
    
        const patient = await Patient.find(query);
        
        if (!patient || patient.length === 0) {
          return res.status(404).json({ message: 'Patients not found' });
        }
    
        res.status(200).json(patient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching patient information' });
      }
    }
    

const approvePharmacistRequest = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the request in the NewPharmacistRequest schema
    const request = await NewPharmacistRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(request.password, salt);

    // Create a new Pharmacist using the request data
    const newPharmacist = new Pharmacist({
      username: request.username,
      name: request.name,
      email: request.email,
      password: hashedPassword,
      dateOfBirth: request.dateOfBirth,
      hourlyRate: request.hourlyRate,
      affiliation: request.affiliation,
      educationalBackground: request.educationalBackground,
      status: 'accepted', // Assuming the status for approved pharmacists is 'accepted'
    });

    // Save the new Pharmacist
    await newPharmacist.save();

    // Remove the request from the NewPharmacistRequest schema
    await NewPharmacistRequest.findOneAndRemove({ username: username });

    const emailInfo = await sendApprovalEmail(request.email);

    res.status(200).json({ message: 'Request accepted', emailInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while approving the request' });
  }
};


const rejectPharmacistRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await NewPharmacistRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    const emailInfo = await sendRejectionEmail(request.email);

    res.status(200).json({ message: 'Request rejected', emailInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rejecting the request' });
  }
};

const sendApprovalEmail = async (email) => {
  const subject = 'Pharmacist Application Approval';
  const html = `
    <h1>El7a2ni Pharmacist Application Approval</h1>
    <p>Congratulations! Your pharmacist application has been approved.</p>
    <p>You are now a registered pharmacist. Welcome to our platform!</p>
  `;

  const emailInfo = await sendEmail(email, subject, html);
  return emailInfo;
};

const sendRejectionEmail = async (email) => {
  const subject = 'Pharmacist Application Rejection';
  const html = `
    <h1>El7a2ni Pharmacist Application Rejection</h1>
    <p>We regret to inform you that your pharmacist application has been rejected.</p>
    <p>If you have any questions, please contact our support team.</p>
  `;

  const emailInfo = await sendEmail(email, subject, html);
  return emailInfo;
};

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Add this line to bypass SSL verification
      },
    });
    

    // Send emails to users
    let info = await transporter.sendMail({
      from: "Rebooters",
      to: email,
      subject: subject,
      html: html,
    });

    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Add this line to rethrow the error
  }
};

const viewAllPharmacists = async (req, res) => {
  try {
    const allPharmacists = await Pharmacist.find();
    res.status(200).json(allPharmacists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching pharmacists" });
  }
};

const viewAllAdmins = async (req, res) => {
  try {
    const allAdmins = await Administrator.find();
    res.status(200).json(allAdmins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

const viewAllPatients = async (req, res) => {
  try {
    const allPatients = await Patient.find();
    res.status(200).json(allPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching patients" });
  }
};

const getMonthlyPendingOrdersTotal = async (req, res) => {
  try {
    // Aggregate pipeline to filter pending orders and calculate the total cost by month
    const pipeline = [
      {
        $match: {
          status: 'Pending',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$orderDate',
            },
          },
          totalCost: { $sum: '$total' },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          month: '$_id',
          totalCost: 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await mongoose.connection.db.collection('orders').aggregate(pipeline).toArray();

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error('Error calculating monthly pending orders total:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





module.exports = {  
  addAdministrator,
  removeUserFromSystem,
  viewPharmacistApplication,
  viewPharmacistInformation,
  viewPatientInformation,
  viewMedicineInventory,
  filterMedicineByMedicinalUse,
  searchMedicineByName,
  approvePharmacistRequest,
  rejectPharmacistRequest,
  logout, changePassword, createToken, sendApprovalEmail, sendRejectionEmail,sendEmail
,generateSalesReport , getAdminProfile,viewAllPharmacists,viewAllAdmins,viewAllPatients,getMonthlyPendingOrdersTotal
}; 