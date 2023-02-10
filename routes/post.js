const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');
const authController = require('../controllers/auth');

// POST /users
// API endpoint to insert a new user document
router.post("/users/admin", usersController.updateAdminPasswd);

// POST /signup
// API endpoint to signup customers
router.post('/signup', authController.signup);

// POST /login
// API endpoint to signup customers
router.post('/login', authController.login);


module.exports = router;