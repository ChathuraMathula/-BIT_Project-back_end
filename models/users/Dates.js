const { postDocument, getDocument, getCollection } = require("../../util/database");
const { isValid } = require("../../util/validator");

/**
 *
 * @param {object} dateObj The date object to be inserted into database's availableDates collection
 * @returns A promise resolving the result of the insert operation
 */
exports.saveAvailableDate = async (dateObj) => {
  console.log(dateObj, "+++++++++");
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

    console.log(obj);

    return await getDocument("availableDates", obj, { projection: { _id: 0 } }).then(
      (result) => {
        console.log("------> ", result);
        if (result) {
          return null;
        } else {
          return postDocument("availableDates", dateObj);
        }
      }
    );
  }
};

/**
 * @returns A promise resolving an array of available date documents
 */
exports.fetchAvailableDates = async () => {
    return await getCollection("availableDates");
}
