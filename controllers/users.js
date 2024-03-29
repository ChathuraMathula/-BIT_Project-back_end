const Users = require("../models/Users");
const path = require("path");
const fs = require("fs");
const { comparePasswords, toHashPassword } = require("../util/password");
const { sanitize } = require("../util/sanitizer");
const { isValid } = require("../util/validator");
const { postDocument } = require("../util/database");
const { getPhotographerDetails } = require("../models/Photographer");

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {callback} next
 */
exports.signup = async (req, res) => {
  try {
    const firstname = sanitize(req.body.firstname.trim());
    const lastname = sanitize(req.body.lastname.trim());
    const username = sanitize(req.body.username.trim());
    const phoneNo = sanitize(req.body.phoneNo.trim());
    const address = sanitize(req.body.address.trim());
    const email = sanitize(req.body.email.trim());
    const password = sanitize(req.body.password.trim());

    const existingUser = await Users.fetchUser(
      { username: username },
      {
        projection: {
          username: 1,
        },
      }
    ).catch(() => false);

    if (existingUser) {
      res.status(400).json({ error: "User already exists. 😐" });
    } else if (
      isValid("name", firstname) &&
      isValid("name", lastname) &&
      isValid("username", username) &&
      isValid("password", password) &&
      isValid("email", email) &&
      isValid("phoneNo", phoneNo) &&
      isValid("address", address)
    ) {
      const user = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        phoneNo: phoneNo,
        address: address,
        email: email,
        password: await toHashPassword(password),
        role: "customer",
      };

      if (req.file?.fieldname === "image") {
        user.image = {
          name: req.file.filename,
          destination: "static/images/users/profile",
        };
      }

      await postDocument("users", user)
        .then((result) => {
          if (result) {
            res.status(200).json({ success: "Successfully Registered. 😍" });
          } else {
            throw "error";
          }
        })
        .catch((error) => {
          if (error) {
            res
              .status(400)
              .json({ error: "Sorry...! 😟 Registration failed." });
          }
        });
    } else {
      res.status(400).json({ error: "Invalid data... 😣" });
    }
  } catch {
    res.status(400).json({ error: "Sorry...! 😟 Registration failed." });
  }
};

// fetch array of users documents from the database
exports.getUsers = (req, res) => {
  Users.fetchUsers().then((result) => res.json(result));
};

exports.getUserProfilePic = async (req, res) => {
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
      console.log(error);
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
exports.getVerifiedUser = (req, res) => {
  Users.fetchUser({ username: req.authData.username })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      if (error) {
        console.log(error);
        res.status(401).send();
      }
    });
};

exports.getUser = (req, res) => {
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
exports.updateUserContactDetails = async (req, res) => {
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
              res.status(200).json({ success: "Saved successfully..." });
            } else if (result.modifiedCount === 0) {
              res.status(200).json({ success: "You have already saved contact details." });
            }
          } else {
            throw "error";
          }
        })
        .catch((error) => {
          if (error) {
            res.status(400).json({ error: "Sorry...! Save failed." });
          }
        });
    } else {
      res.status(400).json({ error: "Invalid data..." });
    }
  }
};

exports.updatePhotographerPersonalDetails = async (req, res) => {
  try {
    const username = sanitize(req.body.username.trim());
    const firstname = sanitize(req.body.firstname.trim());
    const lastname = sanitize(req.body.lastname.trim());
    const summary = sanitize(req.body.summary.trim());
    const bankName = sanitize(req.body.bankName.trim());
    const bankAccountNo = sanitize(req.body.bankAccountNo.trim());

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
              res.status(200).json({ success: "Saved successfully..." });
            } else if (result.modifiedCount === 0) {
              res.status(200).json({ success: "You have already saved..." });
            }
          } else {
            throw "error";
          }
        })
        .catch((error) => {
          if (error) {
            res.status(400).json({ error: "Sorry...! Save failed." });
          }
        });
    } else {
      res.status(400).json({ error: "Invalid data..." });
    }
  } catch (error) {}
};

exports.updateUserPassword = async (req, res) => {
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
                res.status(200).json({ success: "Password changed..." });
              } else if (result.modifiedCount === 0) {
                res
                  .status(200)
                  .json({ success: "You have already saved..." });
              }
            } else {
              throw "error";
            }
          })
          .catch((error) => {
            if (error) {
              res.status(400).json({ error: "Sorry...! Save failed." });
            }
          });
      } else {
        res.status(400).json({ error: "Incorrect old password..." });
      }
    } else {
      res.status(400).json({ error: "Invalid data..." });
    }
  }
};

exports.updateUserImage = async (req, res) => {
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
        res.status(200).json({ success: "Profile picture saved..." });
      } else {
        throw "error";
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Sorry...! Save failed." });
  }
};

exports.removeUserImage = async (req, res) => {
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

    
    if (removeImage) {
      fs.unlink(filePath, (error) => {
        if (error) {
          return;
        }
      });
      await Users.updateUser(filter, updateFilter).then((result) => {
        if (result.modifiedCount >= 0) {
          res.status(200).json({ success: "Profile picture removed..." });
        } else {
          throw "error";
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Sorry...! Remove failed." });
  }
};

exports.getPhotographerDetails = async (req, res) => {
  await getPhotographerDetails()
    .then((details) => {
      if (details) {
        res.status(200).json(details);
      } else {
        throw "photographer details error";
      }
    })
    .catch((error) => {
      if (error) {
        res.status(400).json({ success: false });
      }
    });
};

exports.getPhotographerProfilePicure = async (req, res) => {
  try {
    const username = "photographer";
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
      console.log(error);
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

exports.resetUserPassword = async (req, res) => {
  try {
    const newPassword = sanitize(req.body.password.trim());
    const username = sanitize(req.body.username.trim());

    if (isValid("password", newPassword)) {
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
              return res.status(200).json({ success: true });
            }
          } else {
            throw "error";
          }
        })
        .catch((error) => {
          if (error) {
            return res.status(400).json({ success: false });
          }
        });
    }
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};
