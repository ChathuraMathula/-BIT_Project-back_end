const Customer = require("../models/users/Customer");
const Users = require("../models/users/Users");

/** ==============================================================================================
 * 
 *    signup(req, res, next) handles customer signup tasks
 * 
=================================================================================================*/
exports.signup = (req, res, next) => {
  const newCustomer = new Customer(req.body); // create a customer instance

  console.log("BODY: ", req.body);
  // if a profile picture is uploaded
  if (req.file && req.file.fieldname === "profilePicture") {
    const imageFile = req.file;

    // add profile picture details (name, url) to the database
    newCustomer.profilePicture = {
      name: imageFile.filename,
      url: `http:localhost:3001/users/profile/photo/${imageFile.filename}`,
    };
  }
  console.log(req.file)
  newCustomer.save().then(
    (resolve) => {
      // if document is successfully stored in the collection
      if (resolve) {
        console.log(
          `New User Registered ==> username: ${newCustomer.username}`
        );

        res.status(200).json({
          message: "Registration Successful.",
        });
      }
    },
    (reject) => {
      // if the customer data not valid send 400 status code to the frontend
      if (reject === "invalidCustomerData") {
        res.status(400).json({
          message: "Registration Faild.",
        });
      } else {
        // if the database error happens status code 500 = internal server error is sent.
        res.status(500).json({
          message: "Registration Faild.",
        });
      }
    }
  );
};
/** =================== END signup(req, res, next) ============================================== */

// fetch array of users documents from the database
exports.getUsers = (req, res, next) => {
  Users.fetchUsers().then((result) => res.json(result));
};
