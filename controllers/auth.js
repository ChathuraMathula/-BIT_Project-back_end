const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { use, options } = require("../routes/post");
const { query } = require("express");
const getDb = require("../util/database").getDb;

const JWT_SECRET = "my_secret";

exports.signup = async (req, res, next) => {
  try {
    Users = getDb().collection("users");
    const {
      username,
      password,
      firstname,
      lastname,
      email,
      phone_no,
      postal_address,
    } = req.body;

    if (
      !(
        username &&
        password &&
        firstname &&
        lastname &&
        email &&
        phone_no &&
        postal_address
      )
    ) {
      res.status(400).json({ message: "All fields required" });
      return next();
    }

    const oldUser = await Users.findOne({ username: username });
    if (oldUser) {
      res.status(400).json({ message: "This username already exists" });
      return next();
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const user = await Users.insertOne({
      username: username,
      password: encryptedPassword,
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone_no: phone_no,
      postal_address: postal_address,
      role: "customer",
    });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json(token);
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).json({ message: "All input is required" });
      return next();
    }

    const Users = getDb().collection("users");

    const query = { username: username };
    const options = {
      projection: {
        username: 1,
        password: 1,
        role: 1,
      },
    };
    const user = await Users.findOne(query, options);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: 'login successful', token });
      return next();
    }
    res.status(400).json({message: 'Invalid username or password'});
  } catch (err) {
    console.log("error",err);
  }
};
