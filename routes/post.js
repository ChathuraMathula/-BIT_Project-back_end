const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');
const authController = require('../controllers/auth');

// POST /login
// API endpoint to signup customers
router.post('/login', authController.login);


module.exports = router;