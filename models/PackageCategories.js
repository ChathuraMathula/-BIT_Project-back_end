const { updateDocument } = require("../util/database");

/**
 *
 * @param {string} category name of the category the package should be added to
 * @param {object} updateFilter
 * @returns A promise resolving the result of update operation
 */
exports.updatePackageCategory = async (category, updateFilter) => {
  const filter = { name: category };
  return await updateDocument("packageCategories", filter, updateFilter);
};
