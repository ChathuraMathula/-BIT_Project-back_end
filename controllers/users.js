const Customer = require("../models/users/Customer");
const Users = require("../models/users/Users");
const path = require("path");
const fs = require("fs");
const { comparePasswords, toHashPassword } = require("../util/password");
const { sanitize } = require("../util/sanitizer");
const { isValid } = require("../util/validator");

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

exports.getUserProfilePic = async (req, res, next) => {
  try {
    const username = sanitize(req.body.username.trim());
    const filePath = path.join(
      __dirname,
      "../static/images/users/profile/",
      `${username}.jpeg`
    );

    const contentType = "image/jpeg";

    fs.readFile(filePath, (error, data) => {
      if (!error) {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data, "utf8");
      } else {
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
  } catch (error) {
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
  }
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

/**
 *
 * @param {object} req
 * @param {object} res
 * @returns sends a {success} object as json if user contact details are updated successfully.
 * else sends {error} object as json.
 */
exports.updateUserContactDetails = async (req, res, next) => {
  if (req.body) {
    const username = sanitize(req.body.username);
    const email = sanitize(req.body.email);
    const phoneNo = sanitize(req.body.phoneNo);
    const address = sanitize(req.body.address);

    if (
      isValid("username", username) &&
      isValid("email", email) &&
      isValid("phoneNo", phoneNo) &&
      isValid("address", address)
    ) {
      const filter = { username: username };
      const updateFilter = {
        $set: {
          email: email,
          phoneNo: phoneNo,
          address: address,
        },
      };

      await Users.updateUser(filter, updateFilter)
        .then((result) => {
          if (result) {
            if (result.modifiedCount > 0) {
              res.status(200).json({ success: "Saved successfully... 😎" });
            } else if (result.modifiedCount === 0) {
              res.status(200).json({ success: "You have already saved... 😅" });
            }
          } else {
            throw "error";
          }
        })
        .catch((error) => {
          if (error) {
            res.status(400).json({ error: "Sorry...! 😟 Save failed." });
          }
        });
    } else {
      res.status(400).json({ error: "Invalid data... 😣" });
    }
  }
};

exports.updatePhotographerPersonalDetails = async (req, res, next) => {
  try {
   
    const username = sanitize(req.body.username.trim());
    const firstname = sanitize(req.body.firstname.trim());
    const lastname = sanitize(req.body.lastname.trim());
    const summary = sanitize(req.body.summary.trim());
    const bankName = sanitize(req.body.bankName.trim());
    const bankAccountNo =sanitize(req.body.bankAccountNo.trim());

    if (
      isValid("username", username) &&
      isValid("name", firstname) &&
      isValid("name", lastname) &&
      isValid("summary", summary) &&
      isValid("bankName", bankName) &&
      isValid("bankAccountNo", bankAccountNo)
    ) {
      const filter = { username: username };
      const updateFilter = {
        $set: {
          firstname: firstname,
          lastname: lastname,
          summary: summary,
          bankName: bankName,
          bankAccountNo: bankAccountNo,
        },
      };

      await Users.updateUser(filter, updateFilter)
        .then((result) => {
          if (result) {
            if (result.modifiedCount > 0) {
              res.status(200).json({ success: "Saved successfully... 😎" });
            } else if (result.modifiedCount === 0) {
              res.status(200).json({ success: "You have already saved... 😅" });
            }
          } else {
            throw "error";
          }
        })
        .catch((error) => {
          if (error) {
            res.status(400).json({ error: "Sorry...! 😟 Save failed." });
          }
        });
    } else {
      res.status(400).json({ error: "Invalid data... 😣" });
    }
  } catch (error) {
    
  }
};

exports.updateUserPassword = async (req, res, next) => {
  if (req.body) {
    const username = sanitize(req.body.username.trim());
    const oldPassword = sanitize(req.body.oldPassword.trim());
    const newPassword = sanitize(req.body.newPassword.trim());

    if (
      isValid("username", username) &&
      isValid("password", oldPassword) &&
      isValid("password", newPassword)
    ) {
      const query = { username: username };
      const options = {
        projection: {
          password: 1,
        },
      };
      const isPasswordCorrect = await Users.fetchUser(query, options)
        .then((user) => user.password)
        .then((password) => {
          return comparePasswords(oldPassword, password);
        })
        .catch((error) => {
          if (error) return false;
        });

      console.log("___-----> ", isPasswordCorrect);

      if (isPasswordCorrect) {
        const filter = { username: username };
        const updateFilter = {
          $set: {
            password: await toHashPassword(newPassword),
          },
        };

        await Users.updateUser(filter, updateFilter)
          .then((result) => {
            if (result) {
              if (result.modifiedCount > 0) {
                res.status(200).json({ success: "Password changed... 😎" });
              } else if (result.modifiedCount === 0) {
                res
                  .status(200)
                  .json({ success: "You have already saved... 😅" });
              }
            } else {
              throw "error";
            }
          })
          .catch((error) => {
            if (error) {
              res.status(400).json({ error: "Sorry...! 😟 Save failed." });
            }
          });
      } else {
        res.status(400).json({ error: "Incorrect old password... 😣" });
      }
    } else {
      res.status(400).json({ error: "Invalid data... 😣" });
    }
  }
};

exports.updateUserImage = async (req, res, next) => {
  try {
    const username = sanitize(req.body.username.trim());
    const image = req.file;
    const filter = { username: username };
    const updateFilter = {
      $set: {
        image: {
          name: image.filename,
          destination: "static/images/users/profile",
        },
      },
    };

    await Users.updateUser(filter, updateFilter).then((result) => {
      if (result.modifiedCount >= 0) {
        res.status(200).json({ success: "Profile picture saved... 😎" });
      } else {
        throw "error";
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Sorry...! 😟 Save failed." });
  }
};

exports.removeUserImage = async (req, res, next) => {
  try {
    const username = sanitize(req.body.username.trim());
    const removeImage = sanitize(req.body.removeImage.trim());
    const filter = { username: username };
    const updateFilter = {
      $set: {
        image: null,
      },
    };

    const filePath = path.join(
      __dirname,
      "../static/images/users/profile/",
      `${username}.jpeg`
    );

    console.log(">>>>>>>>>>>> ", removeImage);
    if (removeImage) {
      fs.unlink(filePath, (error) => {
        if (error) {
          throw "error";
        }
      });
      await Users.updateUser(filter, updateFilter).then((result) => {
        if (result.modifiedCount >= 0) {
          res.status(200).json({ success: "Profile picture removed... 😎" });
        } else {
          throw "error";
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Sorry...! 😟 Remove failed." });
  }
};
