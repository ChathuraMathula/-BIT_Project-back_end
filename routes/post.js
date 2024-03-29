const express = require("express");

const router = express.Router();
const multer = require("multer");
const upload = multer();

const usersController = require("../controllers/users");
const authController = require("../controllers/auth");
const packageController = require("../controllers/package");
const dateController = require("../controllers/dates");
const reservationsController = require("../controllers/reservations");
const portfolioController = require("../controllers/portfolio");
const { UploadProfilePhoto } = require("../middleware/UploadProfilePhoto");
const { UploadPaymentSlip } = require("../middleware/UploadPaymentSlip");
const { verifyToken } = require("../middleware/Auth");
const {
  UploadPortfolioImages,
} = require("../middleware/UploadPortfolioImages");

// POST /login
// API endpoint to login users
router.post("/login", upload.none(), authController.login);

// POST /logout
// API endpoint to logout users
router.post("/logout", verifyToken, authController.logout);

// POST /user/update/contact/details
// API endpoint update user contact details (email, address, phone number)
router.post(
  "/user/update/contact/details",
  verifyToken,
  upload.none(),
  usersController.updateUserContactDetails
);

// POST /user/update/contact/details
// API endpoint update user password with the old one
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
router.post("/admin/add/package", verifyToken, packageController.addNewPackage);

// POST /admin/update/package
// API endpoint to update package
router.post(
  "/admin/update/package",
  verifyToken,
  packageController.updatePackage
);

// POST /update/package/category
// API endpoint to update package category
router.post(
  "/update/package/category/extra/services",
  verifyToken,
  packageController.addCategoryExtraServices
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
// API endpoint to remove an available date
router.post(
  "/admin/remove/available/date",
  verifyToken,
  dateController.removeAvailableDate
);

// POST /get/available/date
// API endpoint to get an available date
router.post(
  "/get/available/date",
  // verifyToken,
  dateController.getAvailableDate
);

// POST /customer/send/reservation/
// API endpoint send a reservation request
router.post(
  "/customer/send/reservation/request",
  verifyToken,
  reservationsController.setNewReservation
);

// POST /photographer/send/reservation/payment/details
// API endpoint send a reservation payment details
router.post(
  "/photographer/send/reservation/payment/details",
  verifyToken,
  reservationsController.addPhotographerPaymentDetails
);

// POST /photographer/remove/reservation
// API endpoint remove a reservation document 
router.post(
  "/remove/reservation",
  verifyToken,
  reservationsController.removeReservation
);

// POST /photographer/reject/reservation
// API endpoint reject a reservation document 
router.post(
  "/reject/reservation",
  verifyToken,
  reservationsController.rejectReservation
);

// POST /customer/send/reservation/payment/details
// API endpoint send customer's payment details for a reservation
router.post(
  "/customer/send/reservation/payment/details",
  verifyToken,
  UploadPaymentSlip.single("paymentSlip"),
  reservationsController.addCustomerPaymentDetails
);

// POST /confirm/reservation
// API endpoint to confirm a reservation
router.post(
  "/confirm/reservation",
  verifyToken,
  reservationsController.confirmReservation
);

// POST /payment/slip/photo
// API endpoint get payment slip photo based on the year, month and day
router.post(
  "/payment/slip/photo",
  verifyToken,
  reservationsController.getReservationPaymentSlipPhoto
);

// POST /upload/portfolio/images
// API endpoint upload and save portfolio images in the file system
router.post(
  "/upload/portfolio/images",
  verifyToken,
  UploadPortfolioImages.array("portfolioImages"),
  portfolioController.uploadPortfolioImages
);

// POST /remove/portfolio/image
// API endpoint remove existing portfolio image
router.post(
  "/remove/portfolio/image",
  verifyToken,
  portfolioController.removePortfolioImage
);

// POST /update/reservation
// API endpoint send customer's payment details for a reservation
router.post(
  "/update/reservation",
  verifyToken,
  reservationsController.updateAdminReservation
);

// POST /forgot/password
// API endpoint to send a reset link to email if forgot password
router.post(
  "/forgot/password",
  authController.sendPasswordResetLink
);

// POST /verify/password/reset
// API endpoint to verify a password reset link
router.post(
  "/verify/password/reset",
  authController.verifyPasswordResetLink
);

// POST /password/reset
// API endpoint to reset user password with a new one
router.post(
  "/password/reset",
  usersController.resetUserPassword
);

module.exports = router;
