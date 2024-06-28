const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require('../models/review.js');
const listing = require('../models/listing.js');
const {isReviewedBy} = require("../middleware.js");
const { review, destroyReview } = require("../controller/review.js");

//Review
router.post("/", review);

//destroyReview
router.delete("/:reviewId",isReviewedBy,destroyReview);

module.exports = router;