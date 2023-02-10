/* 
    Modified at : 08.02.2023
    Utility: Database Connection
    Number of functions: 2
    Functions: 
        dbConnection()
        getDb()
*/

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";

let _db;

// This function makes a connection to the mongodb database and register a callback function
// once the connection is successful.
const connect = callback => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Successfully connected to MongoDB");
      _db = client.db("date_reservation_system");
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

// This function returns the database which is connected to
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found !";
};

exports.connect = connect;
exports.getDb = getDb;
