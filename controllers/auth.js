const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("../util/database");
const { comparePasswords } = require("../util/password");

exports.getJwtSecret = () => {
  const JWT_SECRET = "my_secret"; /* Secret key to generate jwt token */
  return JWT_SECRET;
};

/* ------------------ generateJwtToken() = Function to generate jwt token -------------------------- */
const generateJwtToken = (payload) => {
  const JWT_SECRET = this.getJwtSecret();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
};
/* --------------------------- generateJwtToken() END ---------------------------------------------- */

/* ------------------ login() = Function to send a jwt token when login ---------------------------- */
exports.login = async (req, res, next) => {
  const { username, password } = req.body; // destructure username & password from request body

  let user;
  await database
    .getDocument(
      "users",
      { username: username },
      { projection: { username: 1, password: 1, role: 1, _id: 0 } }
    )
    .then((userDocument) => {
      if (!userDocument) {
        throw "no_such_user";
      } else {
        user = userDocument;
        return comparePasswords(password, userDocument.password);
      }
    })
    .then((isPasswordConfirmed) => {
      if (!isPasswordConfirmed) {
        throw "password_not_matched";
      }
      return;
    })
    .then(() => {
      const jwtToken = generateJwtToken({username: user.username, role: user.role});
      if (jwtToken) {
        // send token as a httpOnly cookie
        res
          .status(200)
          .cookie("token", jwtToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 900000),
          })
          .json({
            user: {
              name: user.username,
              role: user.role,
            },
          });
      } else {
        throw "password_not_matched";
      }
    })
    .catch((error) => {
      if (error) {
        console.log("Login Error", error);
        if (error === "no_such_user") {
          res.status(401).json({ message: "No Such User Found." });
        } else if (error === "password_not_matched") {
          res.status(401).json({ message: "Password did not match." });
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    });
    
  };
  /* ------------------------------------- login() END ----------------------------------------------- */
  
  /* ----------------------------------- logout(); --------------------------------------------- */

  exports.logout = (req, res, next) => {
    if (req.authData.username) {
      res.status(200).clearCookie("token").send();
    } else {
      res.send(500).send();
    }
  }

  /* ------------------------------------ END logout(); ----------------------------------------- */