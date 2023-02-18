const express = require("express");
const app = express();

const database = require("./util/database");

const getRoutes = require("./routes/get");
const postRoutes = require("./routes/post");

app.use(express.json());

// Setting CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(getRoutes);
app.use(postRoutes);

database.connect(() => {
  app.listen(3001, () => {
    console.log("server is listening on port 3001");
  });
});
