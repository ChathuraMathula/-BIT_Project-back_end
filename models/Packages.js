const { query } = require("express");
const {
  getCollection,
  updateDocument,
  postDocument,
  deleteDocuments,
} = require("../util/database");

/**
 * @param {object} query
 * @param {object} options
 * @returns A promise resolving an array of package category documents
 * eg: { name: Wedding, packages: [{ name: Platinum, price: 12000, services: [service 01, service 02] } ] }
 */
exports.fetchPackageCategories = async (query, options) => {
  return await getCollection("packageCategories", query, options);
};

/**
 *
 * @param {string} category name of the category the package should be added to
 * @param {object} package package document eg: { name: Platinum, price: 12000, services: [service 01, service 02]}
 * @returns A promise resolving the result of update operation
 */
exports.savePackage = async (category, package) => {
  const filter = { name: category };
  const updateFilter = {
    $push: { packages: package },
  };
  return await updateDocument("packageCategories", filter, updateFilter);
};

/**
 *
 * @param {string} category name of the category the package should be added to
 * @param {object} package package document eg: { name: Platinum, price: 12000, services: [service 01, service 02]}
 * @returns A promise resolving the result of update operation
 */
exports.updatePackage = async (category, package) => {
  const filter = { name: category, "packages.name": package.name };
  const updateFilter = {
    $set: {
      "packages.$.price": package.price,
      "packages.$.services": package.services,
    },
  };
  return await updateDocument("packageCategories", filter, updateFilter);
};

/**
 *
 * @param {string} category name of the category the package should be added to
 * @param {object} package package document eg: { name: Platinum, price: 12000, services: [service 01, service 02]}
 * @returns A promise resolving the result of update operation
 */
exports.removePackage = async (category, package) => {
  const filter = { name: category };
  const updateFilter = {
    $pull: {
      packages: {
        name: package.name,
      },
    },
  };
  return await updateDocument("packageCategories", filter, updateFilter);
};

/**
 *
 * removes all the categories that does not include packages
 * @returns A promise resolving the result of delete many operation
 */
exports.removeEmptyPackageCategories = async () => {
  const query = { packages: {$exists: true, $size: 0} };
  
  return await deleteDocuments("packageCategories", query);
};

/**
 *
 * @param {object} category package category document to be inserted into the packageCategories
 * collection
 * @returns A promise resolving the result of insert operation
 */
exports.savePackageCategory = async (category) => {
  return await postDocument("packageCategories", category);
};
