exports.addNewPackage = (req, res, next) => {
    console.log(req.body);
    res.json({success: "Successfully Added. 😍"});
};