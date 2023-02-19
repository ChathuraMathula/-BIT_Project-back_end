const Users = require("../models/users/Users");

exports.signup = (req, res, next) => {
  console.log(req.body);

  res.status(200).json({
    Message: "Registration Successful."
  });
  return next();
};

// fetch array of users documents from the database
exports.getUsers = (req, res, next) => {
  Users.fetchUsers().then((result) => res.json(result));
};
