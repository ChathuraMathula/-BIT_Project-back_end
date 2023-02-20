const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("../util/database");


exports.getJwtSecret = () => {
  const JWT_SECRET = "my_secret"; /* Secret key to generate jwt token */
  return JWT_SECRET;
}

/* ------------------ generateJwtToken() = Function to generate jwt token -------------------------- */
const generateJwtToken = (payload) => {
  const JWT_SECRET = this.getJwtSecret();
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

