const express = require('express');

const router = express.Router();
const multer = require('multer');
const upload = multer();


const usersController = require('../controllers/users');
const authController = require('../controllers/auth');
const { UploadProfilePhoto } = require('../middleware/UploadProfilePhoto');
const { verifyToken } = require('../middleware/Auth');

// POST /login
// API endpoint to login users
router.post('/login', upload.none(),authController.login);

// POST /logout
// API endpoint to logout users
router.post('/logout', verifyToken, authController.logout);

// POST /users
// API endpoint to register users (customers)
router.post('/users', UploadProfilePhoto.single("image"), usersController.signup);

module.exports = router;