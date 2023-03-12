const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");
const packageController = require("../controllers/package");
const datesController = require("../controllers/dates");
const { verifyToken } = require("../middleware/Auth");

// GET /user
// API endpoint to get an authentication & verified user document
router.get("/user", verifyToken, usersController.getVerifiedUser);

// GET /users
// API endpoint to get users collection from database
router.get("/users", usersController.getUsers);

// Get /package/categories
// API endpoint to get package category documents
router.get("/package/categories", packageController.getPackageCategories);

// GET /available/dates
// API endpoint to get users collection from database
router.get("/available/dates", datesController.getAvailableDates);

// GET /photographer/details
// API endpoint to get photographer details
router.get("/photographer/details", usersController.getPhotographerDetails);

module.exports = router;
