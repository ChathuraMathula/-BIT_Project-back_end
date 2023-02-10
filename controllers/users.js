const Admin = require("../models/users/Admin");

// fetch admin user from database and pass them to /users/admin API endpoint
exports.getAdminUser = (req, res, next) => {
  Admin.fetch().then(result => res.json(result));
};

// update admin user password
exports.updateAdminPasswd = (req, res, next) => {
  Admin.updatePasswd("new").then(result => console.log(result));
};
