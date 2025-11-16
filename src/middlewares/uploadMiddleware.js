const multer = require('multer');

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the original file name
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; // Allowed image types
  const isValid = allowedTypes.test(file.mimetype);
  const isImage = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());
  
  if (isValid && isImage) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // Reject the file
  }
};

// Create the upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
  },
  fileFilter: fileFilter
});

// Export the upload middleware
module.exports = upload.single('image'); // 'image' is the field name for the uploaded file