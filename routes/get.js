const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");
const packageController = require("../controllers/package");
const datesController = require("../controllers/dates");
const portfolioController = require("../controllers/portfolio");
const { verifyToken } = require("../middleware/Auth");

const path = require("path");

// GET /user
// API endpoint to get an authenticated & verified user document
router.get("/user", verifyToken, usersController.getVerifiedUser);

// GET /users
// API endpoint to get users collection from database
router.get("/users", usersController.getUsers);

// Get /package/categories
// API endpoint to get package category documents
router.get("/package/categories", packageController.getPackageCategories);

// GET /available/dates
// API endpoint to get availabeldates collection from database
router.get("/available/dates", datesController.getAvailableDates);

// GET /photographer/details
// API endpoint to get photographer details
router.get("/photographer/details", usersController.getPhotographerDetails);

// GET /portfolio/images/names
// API endpoint to get names of portfolio images
router.get("/portfolio/images/names", portfolioController.getPortfolioImages);

// GET /photographer/profile/picture
// API endpoint to get photographer profile picture
router.get(
  "/photographer/profile/picture",
  usersController.getPhotographerProfilePicure
);

module.exports = router;
