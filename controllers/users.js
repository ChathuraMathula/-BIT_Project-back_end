const Customer = require("../models/users/Customer");
const Users = require("../models/users/Users");
const path = require("path");
const fs = require("fs");
const { comparePasswords, toHashPassword } = require("../util/password");

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
  console.log("=+=+=> body : ", req.body)
  Users.fetchUser({ username: req.body.username })
    .then((user) => {
      if (user.profilePicture) {
        return user.profilePicture.name;
      } else {
        throw "error";
      }
    })
    .then((profilePicName) => {
      if (profilePicName) {
        let filePath = path.join(
          __dirname,
          "../static/images/users/profile/",
          profilePicName
        );

        let mimetype = path.extname(filePath);

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
          if (!error) {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data, "utf8");
          }
        });
      } else {
        throw "error";
      }
    })
    .catch((error) => {
      if (error) {
        console.log("Profile Picture Error: ", error);
        fs.readFile(
          path.join(
            __dirname,
            "../static/images/users/profile/default/",
            "profilePicture.svg"
          ),
          (error, data) => {
            if (!error) {
              res.writeHead(200, { "Content-Type": "image/svg+xml" });
              res.end(data, "utf8");
            }
          }
        );
      }
    });
};

/**
 *
 * @returns a verified user document to the endpoint as json object
 */
exports.getVerifiedUser = (req, res, next) => {
  Users.fetchUser({ username: req.authData.username })
    .then((user) => {
      console.log("get verified user ", user);
      res.status(200).json(user);
    })
    .catch((error) => {
      if (error) {
        console.log("Get Verified User - ERROR: ", error);
        res.status(401).send();
      }
    });
};

exports.getUser = (req, res, next) => {
  console.log("get user ====> ", req.body)
  Users.fetchUser({ username: req.body.username })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        throw "error";
      }
    })
    .catch((error) => {
      if (error) {
        res.status(401).send();
      }
    });
};

exports.updateUser = async (req, res, next) => {
  const responseMsg = {};
  console.log("Request file ", req.file);
  console.log("Request body ", req.body);

  if (req.body) {
    const updatedUser = req.body;
    let isImageUpdated = req.file ? true : false;
    let isPasswordAdded;
    let isUserUpdated;

    if (updatedUser.oldPassword && updatedUser.newPassword) {
      isPasswordAdded = await Users.fetchUser(
        { username: updatedUser.username },
        { projection: { password: 1 } }
      )
        .then((user) => {
          if (user) {
            return comparePasswords(updatedUser.oldPassword, user.password);
          }
        })
        .then((isPasswordCorrect) => {
          if (isPasswordCorrect) {
            return toHashPassword(updatedUser.newPassword);
          } else {
            delete updatedUser.oldPassword;
            delete updatedUser.newPassword;
            throw "incorrectPassword";
          }
        })
        .then((hashedPassword) => {
          if (hashedPassword) {
            updatedUser.password = hashedPassword;
            delete updatedUser.oldPassword;
            delete updatedUser.newPassword;
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => {
          if (err === "incorrectPassword") {
            // responseMsg.error = "Password change failed. 🙁 Please try again.";
            return false;
          }
        });
    }

    if (Object.keys(updatedUser).length > 2 || req.file) {
      const filter = { username: updatedUser.username };
      const updateFilter = {
        $set: updatedUser,
      };

      isUserUpdated = await Users.updateUser(filter, updateFilter)
        .then((result) => {
          if (result.modifiedCount > 0) {
            return true;
            // responseMsg.success = "Successfully Updated. 🤩";

            // res.status(200).json({ message: responseMsg });
          } else {
            return false;
          }
        })
        .catch((error) => {
          if (error) {
            return false;
            // responseMsg.error = "Sorry...! 🙁 Update failed. Please try again.";
            // res.status(200).json({ message: responseMsg });
          }
        });
    }
    console.log("Password Added: ", isPasswordAdded);
    console.log("User Updated ", isUserUpdated);
    console.log("User Image Updated ", isImageUpdated);
    if (isPasswordAdded && isUserUpdated) {
      responseMsg.passwordUpdate = "Password successfully updated. 😎";
    }
    if (isUserUpdated) {
      responseMsg.userUpdate = "User details successfully updated. 😍";
    }
    if (isImageUpdated) {
      responseMsg.profilePictureUpdate =
        "Profile picture successfully updated. 😉";
    }

    console.log(responseMsg);
    res.status(200).json({ message: responseMsg });
  } else {
    res.status(400).send();
  }
};
