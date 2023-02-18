const express = require("express");

const router = express.Router();

const usersController = require('../controllers/users');


// GET /users
// API endpoint to get users collection from database
router.get("/users", usersController.getUsers);



module.exports = router;
