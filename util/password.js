const bcrypt = require("bcrypt");

/** ===============================================================================================
 *      toHashPassword() converts the given plain text password into a hash value with default 
 *      salt = 10 
 *  =============================================================================================== */
exports.toHashPassword = async (plainTextPassword, salt = 10) => {
  return await bcrypt.hash(plainTextPassword, salt);
};
/** ============================== END toHashPassword() =========================================== */


/** ===============================================================================================
 *      comparePasswords() compare the given plain text with the hashed password and if matched
 *      returns true and otherwise returns false
 *  =============================================================================================== */
exports.comparePasswords = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
/** ============================== END comparePasswords() ========================================= */