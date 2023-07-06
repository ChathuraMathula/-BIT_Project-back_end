
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";

let _db;

/**
 * This function makes a connection to the mongodb database and 
 * register a callback function once the connection is successful. 
 */
exports.connect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("\x1b[34mSuccessfully connected to MongoDB\x1b[0m");
      _db = client.db("date_reservation_system");
      callback();
    })
    .catch((error) => {
      // console.log(error);
      // throw error;
      console.error("\x1b[33mCannot connect to the database\x1b[0m")
      console.log("Exiting process")
      process.exit();
    });
};

/** 
 * @returns the database object which is connected to
*/
exports.getDb = () => {
  if (_db) {
    return _db;
  }
  throw "\x1b[91mNo Database Found !\x1b[0m";
};

/**
 * 
 * @param {string} collection collection name
 * @param {object} query default {}
 * @param {object} options default { projection: { _id: 0 } }
 * @returns promise resolving an array of documents in the collection
 */
exports.getCollection = async (
  collection,
  query = {},
  options = {
    projection: {
      _id: 0,
    },
  }
) => {
  try {
    const db = this.getDb();
    const documents = db.collection(collection);
  
    const documentsArray = await documents.find(query, options).toArray();
    return documentsArray;
  } catch (e) {
    console.log(`${e} : Get Collection Failed`)
    console.log("Exiting process")
    process.exit();
  }
};


/**
 * 
 * @param {string} collection collection name
 * @param {object} query default {}
 * @param {object} options default { projection: { _id: 0 } }
 * @returns promise resolving a document in the collection
 * @returns 
 */
exports.getDocument = async (
  collection,
  query = {},
  options = {
    projection: {
      _id: 0,
      password: 0,
    },
  }
) => {
  try {
    const db = this.getDb();
  
    const documents = db.collection(collection);
  
    const document = await documents.findOne(query, options);
    return document;
  } catch (e) {
      console.log(`${e} : Get Document Failed`)
      console.log("Exiting process")
      process.exit();
  }
};

/**
 * 
 * @param {string} collection name of the collection, the document should be inserted into
 * @param {object} document object of the document to be inserted
 * @returns A promise resolving the result of the insert operation
 */
exports.postDocument = async (collection, document) => {
  try {
    const db = this.getDb();
  
    const collectionName = db.collection(collection);
  
    const result = await collectionName.insertOne(document);
    return result;
  } catch (e) {
      console.log(`${e} : Post Document Failed`)
      console.log("Exiting process")
      process.exit();
  }
};

/**
 * 
 * @param {string} collection The collection name eg: "users"
 * @param {object} filter The filter is used to select the document to update
 * @param {object} updateFilter The update operations to be applied to the document
 * @returns A promise resolving the result of the update operation
 */
exports.updateDocument = async (collection, filter, updateFilter) => {
  try {
    const db = this.getDb();
  
    const documents = db.collection(collection);
  
    const result = await documents.updateOne(filter, updateFilter);
    return result;
  } catch (e) {
      console.log(`${e} : Update Document Failed`)
      console.log("Exiting process")
      process.exit();
  }
};


/**
 * 
 * @param {string} collection The collection name eg: "users"
 * @param {object} query query object to delete many documents
 * @returns A promise resolving the result of the deleteMany operation
 */
exports.deleteDocuments = async (collection, query) => {
  try {
    const db = this.getDb();
  
    const documents = db.collection(collection);
  
    const result = await documents.deleteMany(query);
    return result;
  } catch (e) {
      console.log(`${e} : Delete Documents Failed`)
      console.log("Exiting process")
      process.exit();
  }
};

/**
 * 
 * @param {string} collection The collection name eg: "users"
 * @param {object} query query object to delete a document
 * @returns A promise resolving the result of the deleteOne operation
 */
exports.deleteDocument = async (collection, query) => {
  try {
    const db = this.getDb();
  
    const documents = db.collection(collection);
  
    const result = await documents.deleteOne(query);
    return result;
  } catch (e) {
        console.log(`${e} : Delete Document Failed`)
        console.log("Exiting process")
        process.exit();
  }
};