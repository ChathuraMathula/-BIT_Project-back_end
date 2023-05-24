const { getDocument } = require("../util/database");

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
