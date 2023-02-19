const multer = require('multer');

// configuration for multer to upload profile pictures
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "static/images/users/profile");
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        callback(null, `${req.body.username}.${ext}`);
    }
});

// Multer filter for filtering jpeg & png files
const multerFilter = (req, file, callback) => {
    const ext = file.mimetype.split('/')[1];
    if (ext === 'jpg' || ext === 'png') {
        callback(null, true);
    } else {
        callback(new Error("Not an image file"), false);
    }
};

// calling the multer function
exports.uploadProfilePhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});