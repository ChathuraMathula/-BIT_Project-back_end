const Customer = require("../models/users/Customer");
const Users = require("../models/users/Users");
const path = require("path");
const fs = require("fs");

/**
 * 
 * @param {object} req
 * @param {object} res 
 * @param {callback} next 
 */
exports.signup = (req, res, next) => {
  const newCustomer = new Customer(req.body); // create a customer instance

  console.log("BODY: ", req.body);
  // if a profile picture is uploaded
  if (req.file && req.file.fieldname === "image") {
    const imageFile = req.file;

    // attach profile picture details (name, url) to the user document
    newCustomer.profilePicture = {
      name: imageFile.filename,
      url: `http:localhost:3001/users/user/profile/photo/${imageFile.filename}`,
    };
  }
  console.log(req.file);
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

exports.getUserProfilePic = (req, res, next) => {
  console.log("Authentication Payload: ", req.authData);

  Users.fetchUser({ username: req.authData.username })
    .then((user) => {
      console.log("User: ", user)
      if (user.profilePicture) {
        return user.profilePicture.name;
      }
    }).then(profilePicName => {
      let filePath = path.join(
        __dirname,
        "../static/images/users/profile/",
        profilePicName
      );
    
      console.log("Profile Picture Name: ", profilePicName);
      console.log("file path: ", filePath)
      let mimetype = path.extname(filePath);
      console.log("Mime type: ", mimetype);
    
      let contentType = "text/html";
    
      switch (mimetype) {
        case "png":
          contentType = "image/png";
          break;
        case "jpeg":
          contentType = "image/jpeg";
          break;
      }
    
      fs.readFile(filePath, (error, data) => {
        if (error) {
          console.log("Error: ", error)
        };
    
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data, "utf8")
      });
    })
    .catch((err) => {
      if (err) {
        console.log("Profile Picture Error: ", err);
      }
    });

  
  // res.send("get user profile picture");
};
