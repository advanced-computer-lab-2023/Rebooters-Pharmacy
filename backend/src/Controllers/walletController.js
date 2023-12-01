const Patient = require('../Models/patientModel'); 
const Pharmacist = require('../Models/pharmacistModel');

const checkWalletBalance = async (req, res) => {
    try {
      const userType = req.cookies.userType;
      const username = req.cookies.username;

      let user;
      switch (userType) {
        case 'patient':
          user = await Patient.findOne({ username });
          break;
        case 'pharmacist':
          user = await Pharmacist.findOne({ username });
          break;
        default:
          return res.status(403).json({ message: 'Invalid user type' });
      }

      if (!user) {
        return res.status(404).json({ message: `${userType} not found` });
      }

      const walletBalance = user.wallet === undefined ? 0 : user.wallet;

      res.status(200).json({ walletBalance });
    } catch (error) {
      console.error('Error checking wallet balance:', error);
      res.status(500).json({ message: 'Error checking wallet balance' });
    }
  };

module.exports = {
    checkWalletBalance
};