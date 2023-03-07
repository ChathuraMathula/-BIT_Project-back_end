const { response } = require("express");
const { saveAvailableDate, fetchAvailableDates } = require("../models/users/Dates");

/**
 * controller function for inserting a new Available Date document to the database 
 */
exports.setAvailableDate = async (req, res, next) => {
  try {
    const date = req.body;
    console.log(date);

    await saveAvailableDate(date)
      .then((result) => {
        console.log(result)
        if (result) {
          res.json({ success: true });
        } else {
          throw "error";
        }
      })
      .catch((error) => {
        console.log("Set Available Date: ERROR: ", error);
        res.status(400).json({ success: false });
      });
  } catch (error) {
    console.log("Set Available Date: ERROR: ", error);
    res.status(400).json({ success: false });
  }
};


exports.getAvailableDates = async (req, res, next) => {
    try {
        await fetchAvailableDates().then(dates => {
            if (dates) {
                res.status(200).json(dates);
            } else {
                throw "error";
            }
        }).catch(error => {
            console.log("get available dates : ERROR: ", error);
        })
    } catch (error) {
        console.log("get available dates : ERROR: (inside catch block) ", error);
    }
}