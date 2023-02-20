const express = require('express');

const router = express.Router();

const UploadProfilePhoto = require('../middleware/UploadProfilePhoto').uploadProfilePhoto;

const usersController = require('../controllers/users');
const authController = require('../controllers/auth');

// POST /login
// API endpoint to login users
router.post('/login', authController.login);

// POST /users
// API endpoint to register users (customers)
router.post('/users', UploadProfilePhoto.single('profilePicture'), usersController.signup);


module.exports = router;