const express = require("express");
const { createDonation, updateDonationStatus,getDonatationList, getAllDonatation } = require("../Controllers/DonationController");
const DonatationRouter = express.Router();



// Route for creating a new donation and initiating payment
DonatationRouter.post("/make-donatation", createDonation);

// Route for updating donation status after payment verification
DonatationRouter.post("/verify-payment", updateDonationStatus);
DonatationRouter.get("/all-donatation", getAllDonatation);
DonatationRouter.get("/get-donation-details/:id", getDonatationList);
module.exports = DonatationRouter;
