const {
  fetchAvailableDate,
  fetchAvailableDates,
} = require("../models/Dates");
const {
  addNewReservation,
  updateReservation,
} = require("../models/Reservation");
const { getIO } = require("../util/socket");
const { isValid } = require("../util/validator");
const fs = require("fs");
const path = require("path");
const { fetchUser } = require("../models/Users");
const { sendTransactionEmail } = require("../util/mail");
const { fetchPackageCategories } = require("../models/Packages");

exports.setNewReservation = async (req, res, next) => {
  try {
    const { year: thisYear, month: thisMonth, day: thisDay } = req.body.date;
    const username = req.authData.username;

    let reservation = req.body.reservation;
    reservation.customer = username;
    reservation.state = "pending";
    

    await fetchPackageCategories()
      .then((categories) => {
        for (let category of categories) {
          if (category.name === reservation.category) {
            return category;
          }
        }
      })
      .then((packageCategoryDocument) => {
        
        const packages = packageCategoryDocument.packages;
        for (let package of packages) {
          if (package.name === reservation.package) {
            reservation.packagePrice = package.price;
            reservation.packageServices = package.services;
          }
        }
      });

    const dateDocument = await fetchAvailableDate(thisYear, thisMonth, thisDay);

    if (!dateDocument.hasOwnProperty("reservation")) {
      await addNewReservation(thisYear, thisMonth, thisDay, reservation)
        .then((result) => {
          if (result) {
            res.status(200).json({ success: true });
          } else {
            throw "add new reservation error";
          }
        })
        .catch((error) => {
          if (error) res.status(400).json({ success: false });
        });

      await fetchAvailableDates().then((dates) => {
        const io = getIO();
        io.emit("dates", dates);
      });
    } else {
      res.status(400).json({
        error:
          "Sorry..! It seems like someone had already got reserved this date. 😕",
      });
    }

  } catch (error) {
    res
      .status(400)
      .json({ error: "Sorry..! Sending reservation request failed. 😕" });
  }
};

exports.addPhotographerPaymentDetails = async (req, res, next) => {
  
  try {
    const { date: date, costs: costs, message: message } = req.body;

    const now = new Date();

    const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24;

    const updateFilter = {
      $set: {
        "reservation.costs": costs,
        "reservation.message.photographer": [message.photographer],
        "reservation.startsAt": now.valueOf(),
        "reservation.endsAt": now.valueOf() + DAY_IN_MILISECONDS,
      },
    };
    await updateReservation(date.year, date.month, date.day, updateFilter)
      .then((result) => {
        if (result) {
          res.status(200).json({ success: true });
        } else {
          throw "update reservation photographer payment details error";
        }
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.rejectReservation = async (req, res, next) => {
  
  try {
    const { date: date, customer: customer, message: message } = req.body;

    if (customer && message) {
      const updateFilter = {
        $unset: { reservation: {} },
        $push: { rejections: { customer: customer, message: message } },
      };
      await updateReservation(date.year, date.month, date.day, updateFilter)
        .then((result) => {
          if (result) {
            res.status(200).json({ success: true });
          } else {
            throw "reject reservation error";
          }
        })
        .catch((error) => {
          res.status(400).json({ success: false });
        });
    }
    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

exports.removeReservation = async (req, res, next) => {
  
  try {
    const { date: date } = req.body;

    const updateFilter = {
      $unset: { reservation: {} },
    };
    await updateReservation(date.year, date.month, date.day, updateFilter)
      .then((result) => {
        if (result) {
          res.status(200).json({ success: true });
        } else {
          throw "remove reservation error";
        }
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

exports.updateAdminReservation = async (req, res, next) => {
  
  try {
    const {
      date: date,
      costs: costs,
      event: event,
      package: package,
      category: category,
      extraServices: extraServices,
    } = req.body;

    let packagePrice;
    let packageServices;

    await fetchPackageCategories()
      .then((categories) => {
        for (let categoryDocument of categories) {
          if (categoryDocument.name === category) {
            return categoryDocument;
          }
        }
      })
      .then((packageCategoryDocument) => {
        const packages = packageCategoryDocument.packages;
        for (let packageDocument of packages) {
          if (packageDocument.name === package) {
            packagePrice = packageDocument.price;
            packageServices = packageDocument.services;
          }
        }
      });

    const updateFilter = {
      $set: {
        "reservation.costs": costs,
        "reservation.event": event,
        "reservation.package": package,
        "reservation.category": category,
        "reservation.packagePrice": packagePrice,
        "reservation.packageServices": packageServices,
        "reservation.extraServices": extraServices,
      },
    };
    await updateReservation(date.year, date.month, date.day, updateFilter)
      .then((result) => {
        if (result) {
          res.status(200).json({ success: true });
        } else {
          throw "update reservation error";
        }
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

exports.addCustomerPaymentDetails = async (req, res, next) => {
  try {
    const {
      year: year,
      month: month,
      day: day,
      paymentMethod: paymentMethod,
      paidDate: paidDate,
      paidTime: paidTime,
      paidAmount: paidAmount,
    } = req.body;

    if (paymentMethod === "bank") {
      const paidBranch = req.body.paidBranch;
      if (
        isValid("bankBranchName", paidBranch) &&
        isValid("paidAmount", paidAmount) &&
        isValid("date", paidDate) &&
        isValid("time", paidTime)
      ) {
        const payment = {
          method: paymentMethod,
          branch: paidBranch,
          amount: paidAmount,
          date: paidDate,
          time: paidTime,
        };

        const updateFilter = {
          $set: {
            "reservation.payment": payment,
          },
          $unset: {
            "reservation.endsAt": null,
            "reservation.startsAt": null,
          },
        };
        

        await updateReservation(+year, +month, +day, updateFilter)
          .then((result) => {
            if (result.modifiedCount > 0) {
              res.status(200).json({ success: true });
            } else {
              throw "update reservation photographer payment details error";
            }
          })
          .catch((error) => {
            res.status(400).json({ success: false });
          });
      } else {
        res.status(400).json({ success: false });
      }
    } else if (paymentMethod === "online banking") {
      if (
        isValid("paidAmount", paidAmount) &&
        isValid("date", paidDate) &&
        isValid("time", paidTime)
      ) {
        const payment = {
          method: paymentMethod,
          amount: paidAmount,
          date: paidDate,
          time: paidTime,
        };

        const updateFilter = {
          $set: {
            "reservation.payment": payment,
          },
          $unset: {
            "reservation.endsAt": null,
            "reservation.startsAt": null,
          },
        };

        await updateReservation(+year, +month, +day, updateFilter)
          .then((result) => {
            if (result.modifiedCount > 0) {
              res.status(200).json({ success: true });
            } else {
              throw "update reservation photographer payment details error";
            }
          })
          .catch((error) => {
            res.status(400).json({ success: false });
          });
      } else {
        res.status(400).json({ success: false });
      }
    }

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.confirmReservation = async (req, res, next) => {
  try {
    const date = req.body.date;

    const updateFilter = {
      $set: {
        "reservation.state": "confirmed",
      },
    };
    await updateReservation(+date.year, +date.month, +date.day, updateFilter)
      .then((result) => {
        if (result.modifiedCount > 0) {
          res.status(200).json({ success: true });

          fetchAvailableDate(date.year, date.month, date.day)
            .then((confirmedDate) => {
              return confirmedDate.reservation.customer;
            })
            .then((customerName) => {
              const query = { username: customerName };
              const options = { projection: { _id: 0 } };
              return fetchUser(query, options);
            })
            .then((customerDocument) => {
              const email = customerDocument.email;
              const firstname = customerDocument.firstname;
              const lastname = customerDocument.lastname;

              const htmlContent = `
              <html>
                <body>
                  <h1>Reservation Successful</h1>
                  <p>Your reservation request on 
                  <b>${date.day}/${+date.month + 1}/${date.year}</b> 
                  has been confirmed 😊</p>
                </body>
              </html>
              `;

              const emailObject = {
                subject: "Reservation Successful",
                sender: {
                  email: "admin@dilshaphotography.com",
                },
                to: [
                  {
                    name: `${firstname} ${lastname}`,
                    email: email,
                  },
                ],
                htmlContent: htmlContent,
              };
              sendTransactionEmail(emailObject);
            });
        } else {
          throw "confirm reservation error";
        }
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });

    await fetchAvailableDates().then((dates) => {
      const io = getIO();
      io.emit("dates", dates);
    });
  } catch (error) {}
};

exports.getReservationPaymentSlipPhoto = async (req, res, next) => {
  try {
    const { year: year, month: month, day: day } = req.body;
    const filePath = path.join(
      __dirname,
      "../static/images/payment/slips/",
      `${year}_${month}_${day}.jpeg`
    );

    const contentType = "image/jpeg";

    fs.readFile(filePath, (error, data) => {
      if (!error) {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data, "utf8");
      } else {
        fs.readFile(
          path.join(
            __dirname,
            "../static/images/users/profile/default/",
            "profilePicture.svg"
          ),
          (error, data) => {
            if (!error) {
              res.writeHead(200, { "Content-Type": "image/svg+xml" });
              res.end(data, "utf8");
            }
          }
        );
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
      fs.readFile(
        path.join(
          __dirname,
          "../static/images/users/profile/default/",
          "profilePicture.svg"
        ),
        (error, data) => {
          if (!error) {
            res.writeHead(200, { "Content-Type": "image/svg+xml" });
            res.end(data, "utf8");
          }
        }
      );
    }
  }
};
