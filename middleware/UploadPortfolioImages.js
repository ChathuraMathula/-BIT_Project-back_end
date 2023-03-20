const multer = require("multer");
const path = require("path");

// configuration for multer to upload portfolio pictures
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "static/images/portfolio");
  },
  filename: (req, file, callback) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, suffix + path.extname(file.originalname));
  },
});

// Multer filter for filtering jpeg & png files
const multerFilter = (req, file, callback) => {
  const ext = file.mimetype.split("/")[1];
  if (ext === "jpeg" || ext === "png" || ext === "jpg") {
    callback(null, true);
  } else {
    callback(new Error("Not an image file"), false);
  }
};

// calling the multer function
exports.UploadPortfolioImages = multer({
  storage: multerStorage,
  limits: { fileSize: 2000000 }, // 2MB
  fileFilter: multerFilter,
});
