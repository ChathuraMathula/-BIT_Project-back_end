const express = require("express");

const router = express.Router();
const multer = require("multer");
const upload = multer();

const usersController = require("../controllers/users");
const authController = require("../controllers/auth");
const packageController = require("../controllers/package");
const dateController = require("../controllers/dates");
const { UploadProfilePhoto } = require("../middleware/UploadProfilePhoto");
const { verifyToken } = require("../middleware/Auth");

// POST /login
// API endpoint to login users
router.post("/login", upload.none(), authController.login);

// POST /logout
// API endpoint to logout users
router.post("/logout", verifyToken, authController.logout);

// POST /user/update/contact/details
// API endpoint update user document
router.post(
  "/user/update/contact/details",
  verifyToken,
  upload.none(),
  usersController.updateUserContactDetails
);

// POST /user/update/contact/details
// API endpoint update user document
router.post(
  "/user/update/password",
  verifyToken,
  upload.none(),
  usersController.updateUserPassword
);

// POST /users
// API endpoint to register users (customers)
router.post(
  "/signup",
  UploadProfilePhoto.single("image"),
  usersController.signup
);

// POST /users/user/profile/picture/remove
// API endpoint to remove user profile picture from file system based on username
router.post(
  "/user/remove/profile/picture",
  verifyToken,
  upload.none(),
  usersController.removeUserImage
);

// POST /user/update/profile/image
// API endpoint update user image
router.post(
  "/user/update/profile/picture",
  verifyToken,
  UploadProfilePhoto.single("image"),
  usersController.updateUserImage
);

// POST /user
// API endpoint get requested user document
router.post("/user", verifyToken, upload.none(), usersController.getUser);

// POST /users/user/profile/picture
// API endpoint to get users profile pictures from file system based on username
router.post(
  "/user/profile/picture",
  verifyToken,
  upload.none(),
  usersController.getUserProfilePic
);

// POST /photographer/update/intro/data
// API endpoint to update photographer personal details such as 
// (firstname | lastname | summary | bankName | bankAccountNo)
router.post(
  "/photographer/update/intro/data",
  verifyToken,
  upload.none(),
  usersController.updatePhotographerPersonalDetails
);

// POST /admin/add/package
// API endpoint to add a package
router.post(
  "/admin/add/package",
  verifyToken,
  packageController.addNewPackage
);


// POST /admin/update/package
// API endpoint to update package
router.post(
  "/admin/update/package",
  verifyToken,
  packageController.updatePackage
);


// POST /admin/remove/package
// API endpoint to remove package
router.post(
  "/admin/remove/package",
  verifyToken,
  packageController.removePackage
);


// POST /admin/add/available/date
// API endpoint to add an available date
router.post(
  "/admin/add/available/date",
  verifyToken,
  dateController.setAvailableDate
);


// POST /admin/remove/available/date
// API endpoint to add an available date
router.post(
  "/admin/remove/available/date",
  verifyToken,
  dateController.removeAvailableDate
);

// POST /admin/get/available/date
// API endpoint to get an available date
router.post(
  "/get/available/date",
  verifyToken,
  dateController.getAvailableDate
);



module.exports = router;
