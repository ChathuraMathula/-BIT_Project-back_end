const { fetchAvailableDates } = require("../models/Dates");
const { updateReservation } = require("../models/Reservation");
const { getIO } = require("../util/socket");

/**
 * checks weather the reservations have timed out and removes if it is
 */
exports.onTimeOutRemoveReservation = async () => {
  setInterval(() => {
    fetchAvailableDates().then((dates) => {
      if (dates) {
        for (let date of dates) {
          if (date?.reservation?.endsAt) {
            const endsAt = date.reservation.endsAt;
            const now = new Date().valueOf();
            if (endsAt <= now) {
              const updateFilter = {
                $unset: { reservation: {} },
              };
              updateReservation(
                date.date.year,
                date.date.month,
                date.date.day,
                updateFilter
              ).then((result) => {
                if (result) {
                  fetchAvailableDates().then((dates) => {
                    const io = getIO();
                    io.emit("dates", dates);
                  });
                }
              });
            }
          }
        }
      }
    });
  }, 1000);
};
