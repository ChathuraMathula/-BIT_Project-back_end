const express = require('express');

const router = express.Router();

const uploadProfilePhoto = require('../middleware/uploadProfilePhoto').uploadProfilePhoto;

const usersController = require('../controllers/users');
const authController = require('../controllers/auth');

// POST /login
// API endpoint to login users
router.post('/login', authController.login);

// POST /users
// API endpoint to register users (customers)
router.post('/users', uploadProfilePhoto.single('image'), usersController.signup);


module.exports = router;