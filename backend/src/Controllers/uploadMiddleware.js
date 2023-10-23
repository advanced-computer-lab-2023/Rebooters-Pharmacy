/*const multer = require('multer');
const path = require('path');

// Define the storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where uploaded images will be stored
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create a multer instance with the storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB (adjust as needed)
  fileFilter: (req, file, cb) => {
    // Define allowed file types (e.g., images)
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed.'));
  },
});

module.exports = upload;
*/