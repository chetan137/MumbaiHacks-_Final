const multer = require('multer');

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage();

// File filter to ensure only valid IBM i / AS400 source code files are accepted
const fileFilter = (req, file, cb) => {
  console.log('🔍 FileFilter called for:', file.originalname);
  console.log('   Field name:', file.fieldname);
  console.log('   MIME type:', file.mimetype);

  // Accepted extensions for IBM i / AS400 source code files
  const allowedExtensions = [
    // DDS files
    '.pf', '.lf', '.dspf', '.prtf',
    // COBOL files
    '.cbl', '.cob', '.cpy',
    // RPG/RPGLE files
    '.rpg', '.rpgle',
    // CL/CLLE files
    '.clp', '.clle'
  ];

  // Extract file extension (handle variable length extensions)
  const fileName = file.originalname.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

  console.log('   Extracted extension:', fileExtension);
  console.log('   Is allowed?:', allowedExtensions.includes(fileExtension));

  if (allowedExtensions.includes(fileExtension)) {
    console.log('   ✅ File ACCEPTED');
    cb(null, true);
  } else {
    console.log('   ❌ File REJECTED');
    cb(new Error('Unsupported file type. Please upload AS400 source file only.'), false);
  }
};

// Configure multer with storage, file filter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files
  }
});

module.exports = upload;
