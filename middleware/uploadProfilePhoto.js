const multer = require('multer');

// configuration for multer to upload profile pictures
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log("MULTER STORAGE === ")
        callback(null, "static/images/users/profile");
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        callback(null, `${req.body.username}.${ext}`);
    }
});

// Multer filter for filtering jpeg & png files
const multerFilter = (req, file, callback) => {
    console.log("FILE : ", file)
    const ext = file.mimetype.split('/')[1];
    if (ext === 'jpeg' || ext === 'png') {
        callback(null, true);
    } else {
        console.error("extension ", ext)
        callback(new Error("Not an image file"), false);
    }
};

// calling the multer function
exports.UploadProfilePhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});