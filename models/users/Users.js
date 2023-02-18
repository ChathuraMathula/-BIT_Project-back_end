/*
    Last Modified: 18.02.2023
    Class: Users
    Methods: fetchUsers()
        
*/

const database = require("../../util/database");

class Users {
  static async fetchUsers() {
    const usersArray = await database.getCollection("users");
    return usersArray;
  }
}

module.exports = Users;
