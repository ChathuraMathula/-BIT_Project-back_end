const {
  fetchPackageCategories,
  savePackage,
  savePackageCategory,
  updatePackage,
  removePackage,
  removePackageCategory,
  removeEmptyPackageCategories,
} = require("../models/users/Packages");
const { postDocument } = require("../util/database");
const { sanitize } = require("../util/sanitizer");
const { isValid } = require("../util/validator");

exports.addNewPackage = async (req, res, next) => {
  console.log(req.body);
  try {
    const category = sanitize(req.body.category.trim());
    const package = sanitize(req.body.package.trim());
    const price = sanitize(req.body.price.trim());
    let services = sanitize(req.body.services.trim());

    if (req.authData.username === "admin") {
      if (
        isValid("packageCategoryName", category) &&
        isValid("name", package) &&
        isValid("float", price) &&
        isValid("packageServices", services)
      ) {
        await fetchPackageCategories()
          .then((categories) => {
            for (let categoryName of categories) {
              if (categoryName.name === category) {
                console.log(categoryName, category);
                const packageDocuments = categoryName.packages;
                if (
                  packageDocuments.some(
                    (packageDocument) => packageDocument.name === package
                  )
                ) {
                  throw "existingPackage";
                } else {
                  return true;
                }
              }
            }
            return false;
          })
          .then((isExistingCategory) => {
            console.log(isExistingCategory);
            if (isExistingCategory) {
              return savePackage(category, {
                name: package,
                price: price,
                services: services.split(","),
              });
            } else {
              return savePackageCategory({
                name: category,
                packages: [
                  {
                    name: package,
                    price: price,
                    services: services.split(","),
                  },
                ],
              });
            }
          })
          .then((result) => {
            if (result) {
              fetchPackageCategories().then((categories) => {
                if (categories) {
                  res
                    .status(200)
                    .json({ categories: categories, success: true });
                }
              });
            } else {
              throw "error";
            }
          })
          .catch((error) => {
            if (error) {
              console.log("package.js : addNewPackage() ERROR: ", error);
              if (error === "existingPackage") {
                res.status(400).json({ error: "Existing package. 😈" });
              } else {
                res
                  .status(400)
                  .json({ error: "Sorry...! 😟 Failed to add your package." });
              }
            }
          });
      } else {
        res.status(400).json({ error: "Invalid data... 😣" });
      }
    }
  } catch (error) {
    console.log(
      "package.js : addNewPackage() ERROR: (Inside Catch Block)",
      error
    );
    res.status(400).json({ error: "Sorry...! 😟 Failed to add your package." });
  }
};

exports.getPackageCategories = async (req, res, next) => {
  await fetchPackageCategories(
    {},
    {
      projection: {
        _id: 0,
      },
    }
  )
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((error) => {
      if (error) {
        console.log("getPackageCategories Error: ", error);
        res.status(400).json({ error: "Not Found" });
      }
    });
};

exports.updatePackage = async (req, res, next) => {
  try {
    const category = sanitize(req.body.category.trim());
    const package = sanitize(req.body.package.trim());
    const price = sanitize(req.body.price.trim());
    let services = sanitize(req.body.services.trim());

    if (req.authData.username === "admin") {
      if (
        isValid("packageCategoryName", category) &&
        isValid("name", package) &&
        isValid("float", price) &&
        isValid("packageServices", services)
      ) {
        await updatePackage(category, {
          name: package,
          price: price,
          services: services.split(","),
        })
          .then((result) => {
            if (result) {
              res.status(200).json({ success: true });
            } else {
              throw "error";
            }
          })
          .catch((error) => {
            if (error) {
              res
                .status(400)
                .json({ error: "Sorry...! 😟 Failed to update your package." });
            }
          });
      } else {
        res.status(400).json({ error: "Invalid data... 😣" });
      }
    }
  } catch (error) {
    console.log(
      "package.js : updatePackage() ERROR: (Inside Catch Block)",
      error
    );
    res
      .status(400)
      .json({ error: "Sorry...! 😟 Failed to update your package." });
  }
};

exports.removePackage = async (req, res, next) => {
  try {
    const category = sanitize(req.body.category.trim());
    const package = sanitize(req.body.package.trim());

    if (req.authData.username === "admin") {
      if (
        isValid("packageCategoryName", category) &&
        isValid("name", package)
      ) {
        await removePackage(category, {
          name: package,
        })
          .then((result) => {
            console.log(result);
            if (result) {
              removeEmptyPackageCategories().then((result) => {
                console.log("+----------> ", result);
                fetchPackageCategories().then((categories) => {
                  if (categories) {
                    res
                      .status(200)
                      .json({ categories: categories, success: true });
                  }
                });
              });
            } else {
              throw "error";
            }
          })
          .catch((error) => {
            if (error) {
              res
                .status(400)
                .json({ error: "Sorry...! 😟 Failed to remove your package." });
            }
          });
      }
    }
  } catch (error) {
    console.log(
      "package.js : removePackage() ERROR: (Inside Catch Block)",
      error
    );
    res
      .status(400)
      .json({ error: "Sorry...! 😟 Failed to remove your package." });
  }
};
