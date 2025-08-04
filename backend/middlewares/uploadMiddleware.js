const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Full path to root-level uploads folder (outside backend)
const uploadDir = path.join(__dirname, '../../uploads');

// Create the folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Allowed file extensions
const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;

// File filter
const fileFilter = (req, file, cb) => {
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype.toLowerCase());

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error(
      'Only image files (jpeg, jpg, png, gif) and document files (pdf, doc, docx) are allowed'
    ));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
