const express = require("express");
const app = express();

const multer = require('multer');
const upload = multer();
const cookieParser = require("cookie-parser");

const database = require("./util/database");

const getRoutes = require("./routes/get");
const postRoutes = require("./routes/post");

app.use(cookieParser()); // parse cookies
app.use(express.json()); // parse "application/json"
// app.use(upload.none()); // parse "multipart/form-data"

// app.use(express.urlencoded({ extended: true }));

// Setting CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(getRoutes);
app.use(postRoutes);

database.connect(() => {
  app.listen(3001, () => {
    console.log("server is listening on port 3001");
  });
});
