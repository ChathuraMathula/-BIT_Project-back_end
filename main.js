const express = require("express");
const app = express();

const database = require("./util/database");

const getRoutes = require("./routes/get");
const postRoutes = require("./routes/post");

app.use(express.json());

app.use(getRoutes);
app.use(postRoutes);

database.connect(() => {
  app.listen(3001, () => {
    console.log("server is listening on port 3001");
  });
});
