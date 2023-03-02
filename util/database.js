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

/* ----------------------------------------------------------------------------------------

  This function makes a connection to the mongodb database and register a callback function
  once the connection is successful. 
 
 ------------------------------------------------------------------------------------------*/
exports.connect = (callback) => {
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

/* ----------------------------------------------------------------------------------------

  This function returns the database which is connected to
 
 ------------------------------------------------------------------------------------------*/
exports.getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found !";
};

/* ----------------------------------------------------------------------------------------
  getCollection(); returns a Promise resolving an Array of documents

  This function returns An array of documents from a collection based on the query and 
  options provided. By default it gets all the documents in a collection without document _id.
 
 ------------------------------------------------------------------------------------------*/

exports.getCollection = async (
  collection,
  query = {},
  options = {
    projection: {
      _id: 0,
    },
  }
) => {
  const db = this.getDb();
  const documents = db.collection(collection);

  const documentsArray = await documents.find(query, options).toArray();
  return documentsArray;
};

/* END getCollection() ----------------------------------------------------------------------------- */

/**  ---------------------------------------------------------------------------------------------------
  getDocument(collection, query, options); returns a Promise resolving an object of document

  This function returns an object of document from a collection based on the query and 
  options provided.
 
-----------------------------------------------------------------------------------------------------*/

exports.getDocument = async (
  collection,
  query,
  options = {
    projection: {
      _id: 0,
      password: 0,
    },
  }
) => {
  const db = this.getDb();

  const documents = db.collection(collection);

  const document = await documents.findOne(query, options);
  return document;
};

/* END getDocument() ------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------
  postDocument(); post a doucument to the database based on the given collection and document

  This function returns an object with _id if the given document is successfully stored in the
  given collection.
 
-----------------------------------------------------------------------------------------------------*/

exports.postDocument = async (collection, document) => {
  const db = this.getDb();

  const collectionName = db.collection(collection);

  const result = await collectionName.insertOne(document);
  return result;
};

/* END postDocument() ------------------------------------------------------------------------------- */

/**
 * 
 * @param {string} collection The collection name eg: "users"
 * @param {object} filter The filter is used to select the document to update
 * @param {object} updateFilter The update operations to be applied to the document
 * @returns A promise resolving the result of the update operation
 */
exports.updateDocument = async (collection, filter, updateFilter) => {
  const db = this.getDb();

  const documents = db.collection(collection);

  const result = await documents.updateOne(filter, updateFilter);
  return result;
};
