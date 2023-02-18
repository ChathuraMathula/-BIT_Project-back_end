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
        res.status(200).json({ token: jwtToken }); // status code 200 = Ok
      }
    } else {
      res.status(401).send(); // status code 401 = Unauthorized 
    } 
  } catch (err) {
    console.log(err);
    res.status(401).send();
  }
  return next();
};
/* ------------------------------------- login() END ----------------------------------------------- */
