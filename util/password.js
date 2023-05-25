const bcrypt = require("bcrypt");

/**
 * 
 * @param {string} plainTextPassword Plain password to be converted into a hash
 * @param {number} salt Salt value to generate the hash. default is 10
 * @returns A promise resolving hash value of the plain text password string
 */
exports.toHashPassword = async (plainTextPassword, salt = 10) => {
  return await bcrypt.hash(plainTextPassword, salt);
};

/**
 * 
 * @param {string} plainTextPassword Plain password string to be compared with hashed password
 * @param {string} hashedPassword hashed password
 * @returns A promise resolving true if plain password string matches the hashed password, else returns false
 */
exports.comparePasswords = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
