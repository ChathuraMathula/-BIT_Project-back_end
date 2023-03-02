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
        throw "error";
      } else {
        user = userDocument;
        return comparePasswords(password, userDocument.password);
      }
    })
    .then((isPasswordConfirmed) => {
      if (!isPasswordConfirmed) {
        throw "error";
      }
      return;
    })
    .then(() => {
      const jwtToken = generateJwtToken({
        username: user.username,
        role: user.role,
      });
      if (jwtToken) {
        // send token as a httpOnly cookie
        res
          .status(200)
          .cookie("token", jwtToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 9000000),
          })
          .json({
            user: {
              name: user.username,
              role: user.role,
            },
          });
      } else {
        throw "error";
      }
    })
    .catch((error) => {
      if (error) {
        console.log("Login Error", error);
        if (error === "error") {
          res
            .status(401)
            .json({
              error:
                "Login Error..! 😣 Username or password incorrect. Please Try Again.",
            });
        }
      }
    });
};
/* ------------------------------------- login() END ----------------------------------------------- */

/* ----------------------------------- logout(); --------------------------------------------- */

exports.logout = (req, res, next) => {
  console.log("logout: ", req.body);
  console.log("logout authData.username: ", req.authData.username);
  if (req.authData.username) {
    res.status(200).clearCookie("token").send();
  } else {
    res.send(500).send();
  }
};

/* ------------------------------------ END logout(); ----------------------------------------- */
