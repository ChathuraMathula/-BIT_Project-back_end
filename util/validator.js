const Sanitizer = require("../util/sanitizer");

const isMatched = (str, pattern) => {
  /* 
        This function takes string value and a regEx pattern.
        Then checks whether the string is empty or not, if not, it returns
        true if the string matches the pattern or otherwise returns false
    */

  if (!this.isEmpty(str)) {
    str = Sanitizer.sanitize(str);
    return pattern.test(str);
  }
  return false;
};

exports.isEmpty = (str) => {
  if (typeof str === "string") {
    str = str.trim();
    if (str === "") {
      return true; // return string if the string is not empty
    }
  }
  return false; // otherwise false
};

/**
 *
 * @param {string} type type of the string passed
 * ( username | password | name | phoneNo | email | address
 * | url_path | bankBranchName | paidAmount | date | time )
 * @param {string} value string to be validated against type
 * @returns returns true if the value is of specified type, else false.
 */
exports.isValid = (type, value) => {
  let pattern = /./;

  switch (type) {
    case "username":
      pattern = /^[a-z0-9]+$/i; // username eg: janakran12
      break;
    case "password":
      // password pattern eg: Mypass@#$!123
      pattern = /^[a-z0-9\!\(\)\-\.\?\[\]\_\`\~\;\:\@\#\$\%\&\*\+\=\^]+$/i;
      break;
    case "name":
      // name pattern eg: Janaka/Ranasinghe
      pattern = /^[a-z]+$/i;
      break;
    case "phoneNo":
      // phone_no pattern eg: 0701234567
      pattern = /^\d{10}$/; // matches exactly 10 digits
      break;
    case "email":
      value = value.toLowerCase(); // converts to a lower case string
      // email pattern eg: example@gmail.com
      pattern = /^[a-z0-9\.\-\_]+[a-z0-9]+\@[a-z0-9\-]+\.[a-z]{2,}$/;
      break;
    case "address":
      // address pattern eg: No 35, Colombo Rd, Polgahawela.
      pattern = /^[a-z0-9\.\,\ ]+$/i;
      break;
    case "url_path":
      // url path pattern eg: /profile/photo
      pattern = /\/[a-z0-9\.]+$/i;
      break;
    case "summary":
      // summary description
      pattern = /^[a-z0-9\.\,\ \+\']+$/i;
      break;
    case "bankName":
      // bank name
      pattern = /^[a-z0-9\.\,\ \']+$/i;
      break;
    case "bankAccountNo":
      // bank account no
      pattern = /^[0-9]+$/i;
      break;
    case "packageCategoryName":
      // eg: Wedding Packages
      pattern = /^[a-zA-Z\ ]+$/i;
      break;
    case "packageServices":
      // eg: comma seperated list (allowd characters are "&,()×")
      pattern = /^[a-zA-Z0-9\ \,\&\(\)\×\x\[\]]+$/i;
      break;
    case "integer":
      // integer numbers
      pattern = /^[0-9]+$/i;
      break;
    case "float":
      // floating point numbers
      pattern = /^[0-9\.]+$/i;
      break;
    case "message":
      // message string
      pattern = /./i;
      break;
    case "bankBranchName":
      // branch name eg: POLGAHAWELA
      pattern = /^[A-Z]+$/;
      break;
    case "paidAmount":
      // paid amount eg: 10,000.00
      pattern = /^[0-9\,]+\.\d{2}$/;
      break;
    case "date":
      // valid date DD/MM/YYYY
      pattern = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/;
      break;
    case "time":
      // valid time in HH:MM format
      pattern = /^(0?[0-9]|[1][0-9]|[2][0-3])\:(0?[0-9]|[12345][0-9])$/;
      break;
    default:
      pattern = /./;
      break;
  }

  // return true if the value is matched to the pattern, otherwise return false
  return isMatched(value, pattern);
};

/**
 *
 * @param {object} imageFile
 * @returns true if image if of mime type "image/png" or "image/jpeg"
 */
exports.isValidImageFile = (imageFile) => {
  if (imageFile) {
    // match /image/png or /image/jpeg pattern
    return /^image\/(png|jpeg)$/.test(imageFile.type);
  } else {
    return false;
  }
};
