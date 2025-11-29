const express = require('express');
const router = express.Router();
const { modernizeLegacyFiles, queryData, refineGeneratedCode } = require('../controllers/modernizeController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * @route   POST /api/v1/modernize
 * @desc    Modernize legacy AS400/IBM i source files using AI
 * @access  Private (requires authentication)
 * @body    Form-data with AS400 source files:
 *          Accepted extensions: .PF, .LF, .DSPF, .PRTF, .cbl, .cob, .cpy, .rpg, .rpgle, .clp, .clle
 */
router.post(
    '/modernize',
    authenticateToken,
    upload.any(), // Accept any AS400 source files
    modernizeLegacyFiles
);

/**
 * @route   POST /api/v1/modernize-demo
 * @desc    Demo endpoint for testing without authentication
 * @access  Public (for testing purposes)
 */
router.post(
    '/modernize-demo',
    (req, res, next) => {
        console.log('📥 Request received at /modernize-demo');
        console.log('   Content-Type:', req.headers['content-type']);
        console.log('   Content-Length:', req.headers['content-length']);
        next();
    },
    upload.any(), // Accept any AS400 source files
    (req, res, next) => {
        console.log('📦 After multer processing:');
        console.log('   req.files:', req.files);
        console.log('   req.files type:', typeof req.files);
        console.log('   req.files is array?:', Array.isArray(req.files));
        console.log('   req.files length:', req.files ? req.files.length : 'undefined');

        // Add a mock user for demo purposes
        req.user = { email: 'demo@example.com', _id: 'demo-user' };

        // Files are already in the correct format (array), no need to reorganize
        modernizeLegacyFiles(req, res, next);
    }
);

/**
 * @route   POST /api/v1/query
 * @desc    Talk to your Data - Convert natural language questions to MongoDB queries and execute them
 * @access  Private (requires authentication)
 * @body    JSON with question field: { "question": "Show me all customers from California" }
 */
router.post(
    '/query',
    authenticateToken,
    queryData
);

/**
 * @route   POST /api/v1/refine
 * @desc    AI Co-Pilot - Refine generated code based on user instructions
 * @access  Private (requires authentication)
 * @body    JSON with code and instruction fields: { "code": "...", "instruction": "add error handling" }
 */
router.post(
    '/refine',
    authenticateToken,
    refineGeneratedCode
);

module.exports = router;
