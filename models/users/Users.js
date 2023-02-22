/*
    Last Modified: 18.02.2023
    Class: Users
    Methods: fetchUsers()
        
*/

const { query } = require("express");
const database = require("../../util/database");

class Users {

  /** 
   *    Name: fetchUsers()
   *    Date Modified: 22.02.2023
   *    fetch users collection from the database
   */
  static async fetchUsers() {
    const usersArray = await database.getCollection(
      "users",
      {},
      {
        projection: {
          _id: 0,
          password: 0,
        },
      }
    );
    return usersArray;
  }


  /** 
   *    Name: fetchUser(query)
   *    Date Modified: 22.02.2023
   *    fetch a single user document from users collection of the database
   */
  static async fetchUser(query) {
    const user = await database.getDocument("users", query);
    return user;
  }
}

module.exports = Users;
