const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("../util/database");

const JWT_SECRET = "my_secret"; /* Secret key to generate jwt token */

/* ------------------ generateJwtToken() = Function to generate jwt token -------------------------- */
const generateJwtToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
};
/* --------------------------- generateJwtToken() END ---------------------------------------------- */

/* ------------------ login() = Function to send a jwt token when login ---------------------------- */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body; // destructure username & password from request body

    // get matched user
    const user = await database.getDocument(
      "users",
      { username, password },
      { projection: { username: 1, password: 1, role: 1, _id: 0 } }
    );

    // generate a jwt token if user exists in the database
    if (user) {
      const jwtToken = generateJwtToken(user);
      if (jwtToken) {
        // send token as a httpOnly cookie
        res
          .status(200)
          .cookie("token", "bearer " + jwtToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 900000),
          })
          .send();
      }
    } else {
      // status code 401 = Unauthorized and clear the httpOnly cookie named "token"
      res.status(401).clearCookie("token").send();
    }
  } catch (err) {
    console.log(err);
    res.status(401).send();
  }
  return next();
};
/* ------------------------------------- login() END ----------------------------------------------- */


/* --------------- verifyToken() = Function to verify token --------------------------------------- */

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // extract the token if available

  if (token) {
    jwt.verify(token, JWT_SECRET, (error, authData) => {
      if (error) {
        res.status(403).send(); // status code = forbidden if token is changed
      } else {
        req.authData = authData;
        console.log("auth.js -- verifyToken() => ", authData);
      }
    });
  } else {
    res.status(401).send(); // status code = unauthorized if token is not found
  }
  return next();
};
/* ------------------------------------- verifyToken() END --------------------------------------- */
