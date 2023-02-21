const express = require("express");

const router = express.Router();

const usersController = require('../controllers/users');
const { verifyToken } = require("../middleware/Auth");

// GET /users/user/profile/picture
// API endpoint to get users profile pictures from file system
router.get("/users/user/profile/picture", verifyToken, usersController.getUserProfilePic);

// GET /users
// API endpoint to get users collection from database
router.get("/users", usersController.getUsers);



module.exports = router;
