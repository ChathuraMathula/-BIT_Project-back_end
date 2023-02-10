const express = require("express");

const router = express.Router();

const usersController = require('../controllers/users');

// GET /users
// API endpoint to get users collection from database
router.get("/users/admin", usersController.getAdminUser);

// GET /dates
// API endpoint to get dates collection from database
router.get("/dates");

// GET /packages
// API endpoint to get packages collection from database
router.get("/packages");

// GET /portfolio/albums
// API endpoint to get portfolio_albums collection from database
router.get("/portfolio/albums");

// GET /reservations
// API endpoint to get reservations collection from database
router.get("/reservations");

// GET /package/categories
// API endpoint to get pkg_categories collection from database
router.get("/package/categories");



module.exports = router;
