const authController = require("../controllers/auth");
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // extract the token if available

  const JWT_SECRET = authController.getJwtSecret();

  if (token) {
    // verify token
    jwt.verify(token, JWT_SECRET, (error, authData) => {
      if (error) {
        return res.status(403).send(); // status code = forbidden if token is changed
      } else {
        req.authData = authData;
        console.log("Token is verified");
      }
    });
  } else {
    return res.status(401).send(); // status code = unauthorized if token is not found
  }
  return next();
};