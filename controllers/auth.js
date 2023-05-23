const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const database = require("../util/database");
const { comparePasswords } = require("../util/password");
const { fetchUser } = require("../models/Users");
const { sendTransactionEmail } = require("../util/mail");
const Sib = require("sib-api-v3-sdk");

const JWT_SECRET = "my_secret"; /* Secret key to generate jwt token */

exports.getJwtSecret = () => {
  return JWT_SECRET;
};

const generateJwtToken = (payload) => {
  // const JWT_SECRET = this.getJwtSecret();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

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
            expires: new Date(Date.now() + (1000 * 60 * 60 * 24)),
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
          res.status(401).json({
            error:
              "Login Error..! Username or password is incorrect. Please Try Again.",
          });
        }
      }
    });
};

exports.logout = (req, res, next) => {
  console.log("logout: ", req.body);
  console.log("logout authData.username: ", req.authData.username);
  if (req.authData.username) {
    res.status(200).clearCookie("token").send();
  } else {
    res.send(500).send();
  }
};

exports.sendPasswordResetLink = async (req, res, next) => {
  console.log("===>>> ", req.body);
  try {
    const username = req.body.username;
    const user = await fetchUser(
      { username: username },
      { projection: { _id: 0 } }
    );
    if (!user || !user.email) {
      return res.status(400).send({ success: false });
    }
    const secret = JWT_SECRET + user.password;
    const token = jwt.sign(
      { email: user.email, username: user.username },
      secret,
      { expiresIn: "500m" }
    );

    const link = `http://localhost:3000/reset/password/${user.username}/${token}`;
    console.log(link);
    if (link) {
      res.status(200).json({ success: true });

      const htmlContent = `
      <html>
        <body>
          <h1>Reset Password</h1>
          <p>Please click the link below to reset your account password 😊</p>
          <a href=${link}>Click Here</a>
        </body>
      </html>
      `;

      const emailObject = {
        subject: "Reset password link",
        sender: {
          email: "admin@reserveu.com",
        },
        to: [{ name: `${user.firstname} ${user.lastname}`, email: user.email }],
        htmlContent: htmlContent,
      };
      console.log(emailObject);
      sendTransactionEmail(emailObject);

      return;
    }
  } catch (error) {}
};

exports.verifyPasswordResetLink = async (req, res, next) => {
  console.log("=====>>>>>>> ", req.body);
  try {
    const username = req.body.username;
    const token = req.body.token;
    const user = await fetchUser(
      { username: username },
      { projection: { _id: 0 } }
    );
    if (!user) {
      return res.status(400).send({ success: false });
    }
    const secret = JWT_SECRET + user.password;
    const verifiedToken = jwt.verify(token, secret);
    console.log(verifiedToken);
    if (verifiedToken) {
      return res.status(200).json({ success: true });
    }
  } catch (error) {}
};
