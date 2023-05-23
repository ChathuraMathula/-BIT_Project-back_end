const {
  postDocument,
  getDocument,
  getCollection,
  deleteDocument,
  updateDocument,
} = require("../../util/database");
const { isValid } = require("../../util/validator");

/**
 *
 * @param {object} dateObj The date object to be inserted into database's availableDates collection
 * @returns A promise resolving the result of the insert operation
 */
exports.saveAvailableDate = async (dateObj) => {
  
  // if date is valid
  if (
    isValid("number", dateObj.date.year) &&
    isValid("number", dateObj.date.month) &&
    isValid("number", dateObj.date.day)
  ) {
    const obj = {
      date: {
        year: dateObj.date.year,
        month: dateObj.date.month,
        day: dateObj.date.day,
      },
    };

    

    return await getDocument("availableDates", obj, {
      projection: { _id: 0 },
    }).then((result) => {
      
      if (result) {
        return null;
      } else {
        return postDocument("availableDates", dateObj);
      }
    });
  }
};

/**
 * @returns A promise resolving an array of available date documents
 */
exports.fetchAvailableDates = async () => {
  return await getCollection("availableDates");
};

/**
 *
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns A promise resolving a date document
 */
exports.fetchAvailableDate = async (thisYear, thisMonth, thisDay) => {
  if (
    isValid("number", thisYear) &&
    isValid("number", thisMonth) &&
    isValid("number", thisDay)
  ) {
    const query = {
      date: {
        year: thisYear,
        month: thisMonth,
        day: thisDay,
      },
    };
    return await getDocument("availableDates", query, {
      projection: { _id: 0 },
    });
  }
};

/**
 *
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns A promise resolving the result of the date delete operation
 */
exports.removeAvailableDate = async (thisYear, thisMonth, thisDay) => {
  if (
    isValid("number", thisYear) &&
    isValid("number", thisMonth) &&
    isValid("number", thisDay)
  ) {
    const query = {
      date: {
        year: thisYear,
        month: thisMonth,
        day: thisDay,
      },
    };
    return await deleteDocument("availableDates", query);
  }
};

/**
 *
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {object} updateFilter
 * @returns A promise resolving the result of the date update operation
 */
exports.updateAvailableDate = async (
  thisYear,
  thisMonth,
  thisDay,
  updateFilter
) => {
  if (
    isValid("number", thisYear) &&
    isValid("number", thisMonth) &&
    isValid("number", thisDay)
  ) {
    const filter = {
      date: {
        year: thisYear,
        month: thisMonth,
        day: thisDay,
      },
    };
    return await updateDocument("availableDates", filter, updateFilter);
  }
};
