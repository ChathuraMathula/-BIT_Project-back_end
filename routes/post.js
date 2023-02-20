const express = require('express');

const router = express.Router();



const usersController = require('../controllers/users');
const authController = require('../controllers/auth');
const { UploadProfilePhoto } = require('../middleware/UploadProfilePhoto');

// POST /login
// API endpoint to login users
router.post('/login', authController.login);

// POST /users
// API endpoint to register users (customers)
router.post('/users', UploadProfilePhoto.single('profilePicture'), usersController.signup);

module.exports = router;