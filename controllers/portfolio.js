const fs = require("fs");
const path = require("path");
const { sanitize } = require("../util/sanitizer");
const { getIO } = require("../util/socket");

exports.uploadPortfolioImages = (req, res, next) => {
  if (req.files) {
    res.json({ success: true });
    let images = [];
    const dirPath = path.join(__dirname, "../static/images/portfolio");
    fs.readdir(dirPath, (error, files) => {
      if (!error) {
        files.forEach((file) => {
          images.push(file);
        });
        console.log(images);
        const io = getIO();
        io.emit("portfolio", images);
      } else {
        console.log("portfolio images upload error: ", error);
      }
    });
  }
};

exports.getPortfolioImages = (req, res, next) => {
  let images = [];
  const dirPath = path.join(__dirname, "../static/images/portfolio");
  fs.readdir(dirPath, (error, files) => {
    if (!error) {
      files.forEach((file) => {
        images.push(file);
      });
      res.json(images);
    } else {
      console.log(error);
    }
  });
};

exports.removePortfolioImage = (req, res, next) => {
  try {
    const imageName = sanitize(req.body.imageName);
    const filePath = path.join(
      __dirname,
      "../static/images/portfolio/",
      `${imageName}`
    );

    if (imageName) {
      fs.unlink(filePath, (error) => {
        if (error) {
          throw "error";
        } else {
          res.status(200).json({ success: true });
          let images = [];
          const dirPath = path.join(__dirname, "../static/images/portfolio");
          fs.readdir(dirPath, (error, files) => {
            if (!error) {
              files.forEach((file) => {
                images.push(file);
              });
              console.log(images);
              const io = getIO();
              io.emit("portfolio", images);
            } else {
              console.log(error);
            }
          });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
