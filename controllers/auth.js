const jwt = require("jsonwebtoken");
const database = require("../util/database");
const { comparePasswords } = require("../util/password");
const { fetchUser } = require("../models/Users");
const { sendTransactionEmail } = require("../util/mail");

const JWT_SECRET = "my_secret"; /* Secret key to generate jwt token */

exports.getJwtSecret = () => {
  return JWT_SECRET;
};

// Generate Json Web Token
const generateJwtToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

exports.login = async (req, res) => {
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
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
        if (error === "error") {
          res.status(401).json({
            error:
              "Login Error..! Username or password is incorrect. Please Try Again.",
          });
        }
      }
    });
};

exports.logout = (req, res) => {
  if (req.authData.username) {
    res.status(200).clearCookie("token").send();
  } else {
    res.send(500).send();
  }
};

exports.sendPasswordResetLink = async (req, res) => {
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
    if (link) {
      res.status(200).json({ success: true });

      const htmlContent = `
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>

      <body style="min-height: 100vh; display: flex; flex-direction: column;">
          <div style="box-shadow: 0 5px 8px 8px rgb(204, 204, 204);">
              <h2 style="margin: 0.3rem auto; text-align: center;">Dilsha Photography</h2>
              <h3 style="margin: 0.3rem auto; text-align: center;">Reset Password</h3>
          </div>

          <br>

          <main style="padding: 1rem;">

              <p>Hi ${user.username},</p>
              <br>
              <p>Forgot your password?</p>
              <p>We recieved a request to reset the password for your account</p>
              <br>
              <div>
                  <p>To reset your password, click the button below:</p>
                  <button style="padding: 0.3rem; cursor: pointer;">
                      Reset Password
                  </button>
              </div>
              <br>
              <div>
                  <p>Or, copy and paste the URL into your browser:</p>
                  <a href="${link}">${link}</a>
              </div>

          </main>

          <footer style="text-align: center; margin-top: 1.2rem; padding: 0.3rem; color: rgb(91, 91, 91);">
              <p>You recieved this email, because you just requested to reset your password.</p>
              <p>&copy; 2023 | Dilsha Photography</p>
          </footer>
      </body>

      </html>
      `;

      const emailObject = {
        subject: "Reset password link",
        sender: {
          email: "admin@dilshaphotography.com",
        },
        to: [{ name: `${user.firstname} ${user.lastname}`, email: user.email }],
        replyTo: {
          email: "admin@dilshaphotography.com",
        },
        htmlContent: htmlContent,
      };

      sendTransactionEmail(emailObject);

      return;
    }
  } catch (error) {
    console.log(error);
  }
};

exports.verifyPasswordResetLink = async (req, res) => {
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
    if (verifiedToken) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(403).send(); // status code = forbidden if token is changed
    }
  } catch (error) {
    if (error) {
      return res.status(403).send(); // status code = forbidden if token is changed
    }
  }
};
