/*
    Last Modified: 08.02.2023
    Class: Admin
    Methods: 
        
*/

const getDb = require("../util/database").getDb;

class Admin {
    
  // This function fetches Admin document from users collection
  static async fetch() {
    const db = getDb();

    const query = { role: "admin" };
    const options = {
      projection: {
        _id: 0,
      },
    };
    const users = db.collection('users');

    const adminObj = await users.findOne(query, options);
    return adminObj;
  }


  static async updatePasswd(new_passwd) {
    const db = getDb();

    const filter = { role: "admin" };
    const updateDocument = {
        $set: {
            password: new_passwd,
        },
    };
    
    const adminObj = await db.collection('users').updateOne(filter, updateDocument);
    return adminObj;
  }
}

module.exports = Admin;
