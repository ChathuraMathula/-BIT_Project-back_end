const express = require("express");
const app = express();

const path = require("path");

const multer = require("multer");
const upload = multer();
const cookieParser = require("cookie-parser");

const database = require("./util/database");

const getRoutes = require("./routes/get");
const postRoutes = require("./routes/post");
const { Server } = require("socket.io");
const { onTimeOutRemoveReservation } = require("./middleware/Reservation");
const { exit } = require("process");

onTimeOutRemoveReservation();

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

app.use(
  "/portfolio/images",
  express.static(path.join(__dirname, "static", "images", "portfolio"))
);

app.use(cookieParser()); // parse cookies
app.use(express.json()); // parse "application/json"

app.use(getRoutes);
app.use(postRoutes);

try{

  database.connect(() => {
    const server = app.listen(3001, () => {
      console.log("\x1b[34mserver is listening on port 3001\x1b[0m");
    });
  
    const io = require("./util/socket").init(server);
    io.on("connection", (socket) => {
      console.log("\x1b[34mClient Connected\x1b[0m");
    });
  });
} catch(e) {
  console.log("Cannot connect to the database")
  console.log("Exiting process")
  process.exit();
}
