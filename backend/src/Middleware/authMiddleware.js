const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const type = req.cookies.userType;
  if (token) {
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "You are not logged in." });
        res.redirect('/login');
      } else {
        if (type === 'patient' && req.originalUrl.startsWith('/api/patient')) {
          res.status(403).json({ message: "Access Allowed." });
        } 
        else if (type === 'admin' && req.originalUrl.startsWith('/api/admin')) {
          res.status(403).json({ message: "Access Allowed." });
        }
        else if (type === 'pharmacist' && req.originalUrl.startsWith('/api/pharmacist')) {
          res.status(403).json({ message: "Access Allowed." });
        }else {
          res.status(403).json({ message: "Access denied." });
        }
      }
    });
  } else {
    res.status(401).json({ message: "You are not logged in." });
  }
};

module.exports = { requireAuth };
