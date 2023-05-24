/*
    Last Modified: 18.02.2023
    Class: Users
    Methods: fetchUsers()
        
*/

const database = require("../util/database");

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
   *
   * @param {object} query query parameters to fetch a document from users collection
   * @param {object} options query options. eg: {projection: {password: 1}}
   * @returns a promise resolving the queried document
   */
  static async fetchUser(query, options) {
    const user = await database.getDocument("users", query, options);
    return user;
  }

  /**
   *
   * @param {object} filter The filter is used to select the user document to update
   * @param {object} updateFilter The update operations to be applied to the user document
   * @returns A promise resolving the result of the update operation
   */
  static async updateUser(filter, updateFilter) {
    const result = await database.updateDocument("users", filter, updateFilter);
    return result;
  }
}

module.exports = Users;
