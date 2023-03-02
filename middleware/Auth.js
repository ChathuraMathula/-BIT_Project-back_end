const authController = require("../controllers/auth");
const jwt = require("jsonwebtoken");

/* --------------- verifyToken() = Function to verify token --------------------------------------- */

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // extract the token if available

  const JWT_SECRET = authController.getJwtSecret();

  if (token) {
    jwt.verify(token, JWT_SECRET, (error, authData) => {
      if (error) {
        res.status(403).send(); // status code = forbidden if token is changed
      } else {
        req.authData = authData;
        console.log("authData ", authData);
      }
    });
  } else {
    res.status(401).send(); // status code = unauthorized if token is not found
    return;
  }
  return next();
};
/* ------------------------------------- verifyToken() END --------------------------------------- */
