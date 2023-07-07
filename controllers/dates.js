const { response } = require("express");
const {
  saveAvailableDate,
  fetchAvailableDates,
  fetchAvailableDate,
  removeAvailableDate,
} = require("../models/Dates");
const { getIO } = require("../util/socket");

/**
 * controller function for inserting a new Available Date document to the database
 */
exports.setAvailableDate = async (req, res, next) => {
  try {
    const date = req.body;

    await saveAvailableDate(date)
      .then((result) => {
        
        if (result) {
          res.json({ success: true });
        } else {
          throw "error";
        }
      })
      .catch((error) => {
        ("Set Available Date: ERROR: ", error);
        res.status(400).json({ success: false });
      });

    fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

/**
 * controller function for retrieving collection of date documents
 */
exports.getAvailableDates = async (req, res, next) => {
  try {
    await fetchAvailableDates()
      .then((dates) => {
        if (dates) {
          res.status(200).json(dates);
        } else {
          throw "error";
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send();
      });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
};

/**
 * controller function for retrieving a date document if it is in the availableDates collection
 */
exports.getAvailableDate = async (req, res, next) => {
  try {
    const year = req.body.date.year;
    const month = req.body.date.month;
    const day = req.body.date.day;

    await fetchAvailableDate(year, month, day)
      .then((dateDocument) => {
        if (dateDocument) {
          res.status(200).json(dateDocument);
        } else {
          res.status(200).json("not found");
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send();
      });

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
};

/**
 * controller function for removing an existing Available Date document from the database
 */
exports.removeAvailableDate = async (req, res, next) => {
  try {
    const thisYear = req.body.date.year;
    const thisMonth = req.body.date.month;
    const thisDay = req.body.date.day;

    await removeAvailableDate(thisYear, thisMonth, thisDay)
      .then((result) => {
        
        if (result) {
          res.json({ success: true });
        } else {
          throw "error";
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({ success: false });
      });

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};
