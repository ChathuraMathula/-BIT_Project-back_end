const Users = require("../models/users/Users");

// fetch array of users documents from the database
exports.getUsers = (req, res, next) => {
  Users.fetchUsers().then(result => res.json(result));
};
