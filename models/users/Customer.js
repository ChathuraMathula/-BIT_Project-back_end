const database = require("../../util/database");
const { toHashPassword } = require("../../util/password");
const { sanitize } = require("../../util/sanitizer");
const { isValid } = require("../../util/validator");

/*
    Last Modified: 17.02.2023
    Class: Customer
    Methods: fetchCustomers()
        
*/

class Customer {
  constructor({
    firstname,
    lastname,
    phoneNo,
    address,
    username,
    password,
    email,
  }) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.phoneNo = phoneNo;
    this.address = address;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = "customer";
  }

  /** ==============================================================================================
   *      isValidCustomer(): performs the server side validation of customer data before
   *      storing them in the data base. It returns true if the data is valid, otherwise
   *      returns false.
  ===============================================================================================  */
  isValidCustomer() {
    const keys = Object.keys(this);
    for (let key of keys) {
      const value = sanitize(this[key]);
      if (isValid(key, value)) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }
  /** =========================== END isValidCustomer() ========================================== */

  /** ==============================================================================================
   *    save() method saves a customer document in the database "users" collection
   *    returns a promise if the doucument is succussfully stored
   ================================================================================================*/
  async save() {
    console.log(this)
    if (!this.isValidCustomer()) {
      return Promise.reject("invalidCustomerData");
    } else {
      // converts the password into a hash value;
      this.password = await toHashPassword(this.password); 
      // store new customer instance (document) in database users collection
      return await database.postDocument("users", this);
    }
  }
  /** ========================= END save() ======================================================= */
}

module.exports = Customer;
