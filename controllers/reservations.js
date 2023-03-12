const {
  fetchAvailableDate,
  fetchAvailableDates,
} = require("../models/users/Dates");
const {
  addNewReservation,
  updateReservation,
} = require("../models/users/Reservation");
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
            res.status(200).json({ success: true });
          } else {
            throw "add new reservation error";
          }
        })
        .catch((error) => {
          if (error) res.status(400).json({ success: false });
        });

      await fetchAvailableDates().then((dates) => {
        const io = getIO();
        io.emit("dates", dates);
      });
    } else {
      res.status(400).json({
        error:
          "Sorry..! It seems like someone had already got reserved this date. 😕",
      });
    }

    // await fetchAvailableDates().then((dates) => {
    //   const io = getIO();
    //   io.emit("dates", dates);
    // });
  } catch (error) {
    console.log(">>>>>>>>___ ", error);
    res
      .status(400)
      .json({ error: "Sorry..! Sending reservation request failed. 😕" });
  }
};

exports.addPhotographerPaymentDetails = async (req, res, next) => {
  console.log(req.body);
  try {
    const { date: date, costs: costs, message: message } = req.body;

    const now = new Date();

    const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24;

    const updateFilter = {
      $set: {
        "reservation.costs": costs,
        "reservation.message.photographer": [message.photographer],
        "reservation.startsAt": now.valueOf(),
        "reservation.endsAt": now.valueOf() + DAY_IN_MILISECONDS,
      },
    };
    await updateReservation(date.year, date.month, date.day, updateFilter)
      .then((result) => {
        if (result) {
          res.status(200).json({ success: true });
        } else {
          throw "update reservation photographer payment details error";
        }
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.removeReservation = async (req, res, next) => {
  console.log(req.body);
  try {
    const { date: date } = req.body;

    const updateFilter = {
      $unset: { reservation: {} },
    };
    await updateReservation(date.year, date.month, date.day, updateFilter)
      .then((result) => {
        if (result) {
          res.status(200).json({ success: true });
        } else {
          throw "remove reservation error";
        }
      })
      .catch((error) => {
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
