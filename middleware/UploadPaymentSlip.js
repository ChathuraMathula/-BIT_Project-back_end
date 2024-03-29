const multer = require('multer');

// configuration for multer to upload payment slip photos
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "static/images/payment/slips");
    },
    filename: (req, file, callback) => {
        const body = req.body;
        const ext = file.mimetype.split('/')[1];
        callback(null, `${body.year}_${body.month}_${body.day}.jpeg`);
    }
});

// Multer filter for filtering jpeg & png files
const multerFilter = (req, file, callback) => {
    
    const ext = file.mimetype.split('/')[1];
    if (ext === 'jpeg' || ext === 'png') {
        callback(null, true);
    } else {
        console.error("extension ", ext)
        callback(new Error("Not an image file"), false);
    }
};

// calling the multer function
exports.UploadPaymentSlip = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});