const { updateDocument } = require("../util/database");

/**
 *
 * @param {number} thisYear
 * @param {number} thisMonth
 * @param {number} thisDay
 * @param {object} reservationData
 * @returns A promise resolving the result of the update operation
 */
exports.addNewReservation = async (
  thisYear,
  thisMonth,
  thisDay,
  reservationData
) => {
  const filter = {
    date: {
      year: thisYear,
      month: thisMonth,
      day: thisDay,
    },
  };
  const updateFilter = {
    $set: { reservation: reservationData },
  };
  return await updateDocument("availableDates", filter, updateFilter);
};

/**
 * @param {number} thisYear
 * @param {number} thisMonth
 * @param {number} thisDay
 * @param {object} updateFilter
 * @returns A promise resolving the result of the update operation
 */
exports.updateReservation = async (
  thisYear,
  thisMonth,
  thisDay,
  updateFilter
) => {
  const filter = {
    date: {
      year: thisYear,
      month: thisMonth,
      day: thisDay,
    },
  };

  return await updateDocument("availableDates", filter, updateFilter);
};
