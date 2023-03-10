const {
  fetchAvailableDate,
  fetchAvailableDates,
} = require("../models/users/Dates");
const { addNewReservation } = require("../models/users/Reservation");
const { getIO } = require("../util/socket");

exports.setNewReservation = async (req, res, next) => {
  try {
    const { year: thisYear, month: thisMonth, day: thisDay } = req.body.date;
    const username = req.authData.username;

    let reservation = req.body.reservation;
    reservation.customer = username;
    reservation.state = "pending";

    const dateDocument = await fetchAvailableDate(thisYear, thisMonth, thisDay);
    
    if (!dateDocument.hasOwnProperty("reservation")) {
      await addNewReservation(thisYear, thisMonth, thisDay, reservation)
        .then((result) => {
          if (result) {
            res.status(400).json({ success: true });
          } else {
            throw "add new reservation error";
          }
        })
        .catch((error) => {
          if (error) res.status(400).json({ error: "Sorry..! Sending reservation request failed. 😕" });
        });
    } else {
        res.status(400).json({error: "Sorry..! It seems like someone had already got reserved this date. 😕"})
    }

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    console.log(">>>>>>>>___ ", error)
    res.status(400).json({ error: "Sorry..! Sending reservation request failed. 😕" });
  }
};
