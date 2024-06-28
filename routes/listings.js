const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js");
const listingsController = require("../controller/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//all listings
router.get("/", listingsController.listings);

//new listing form
router.get("/new", isLoggedin, listingsController.newListingForm);

//create new listing
router.post("/", isLoggedin,upload.single("image"), listingsController.createListing);

//formting similar routes
router
  .route("/:id")
  .get(listingsController.individualList)
  .put(listingsController.update)
  .delete(isLoggedin, listingsController.destroy);

//edit
router.get("/:id/edit", isLoggedin, listingsController.editForm);

module.exports = router;
