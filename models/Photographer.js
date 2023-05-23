/*
    Last Modified: 13.02.2023
    Class: Photographer
    Methods: fetchWelcomeInfo()
        
*/

const { getDocument } = require("../util/database");

// const getDb = require("../../util/database").getDb;

/**
 * @returns A promise resolving a document in the collection
 */
exports.getPhotographerDetails = async () => {
  return await getDocument(
    "users",
    { username: "photographer" },
    {
      projection: {
        _id: 0,
        password: 0,
      },
    }
  );
};

// class Photographer {
//   // This function fetches the photographers details neccessary to display on welcome page
//   static async fetchWelcomeInfo() {
//     const db = getDb();

//     const query = { role: "photographer" };
//     const options = {
//       projection: {
//         firstname: 1,
//         lastname: 1,
//         summary: 1,
//         phone_no: 1,
//       },
//     };

//     const users = db.collection("users");

//     const photographerObj = await users.findOne(query, options);
//     return photographerObj;
//   }
// }

// module.exports = Photographer;

