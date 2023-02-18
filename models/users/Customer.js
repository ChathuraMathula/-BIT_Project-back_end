/*
    Last Modified: 17.02.2023
    Class: Customer
    Methods: fetchCustomers()
        
*/

const getDb = require("../../util/database").getDb;

class Customer {
  static async fetchCustomers() {
    const db = getDb();

    const query = { role: "customer" };
    const options = {
      projection: {
        _id: 0
      },
    };

    const users = db.collection("users");

    const cutomersArray = await users.find(query, options).toArray();
    return cutomersArray;
  }
}

module.exports = Customer;
