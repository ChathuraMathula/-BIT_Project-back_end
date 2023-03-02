const express = require("express");

const router = express.Router();

const usersController = require('../controllers/users');
const { verifyToken } = require("../middleware/Auth");

// GET /user
// API endpoint to get an authentication & verified user document
router.get("/user", verifyToken, usersController.getVerifiedUser);

// GET /users
// API endpoint to get users collection from database
router.get("/users", usersController.getUsers);

// GET /users/user/profile/picture
// API endpoint to get users profile pictures from file system
router.get("/users/user/profile/picture", verifyToken, usersController.getUserProfilePic);



module.exports = router;
