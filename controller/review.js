const listing = require("../models/listing");
const Review = require("../models/review");

module.exports.review = async (req, res) => {
  try {
    let { id } = req.params;
    let list = await listing.findById(id);
    let { rating, comment } = req.body;
    let newReview = new Review({
      rating,
      comment,
    });
    // console.log(newReview);
    newReview.author = req.user._id;
    list.review.push(newReview);
    await newReview.save();
    // console.log(newReview);
    await list.save();
    res.redirect(`/listings/${id}`);
  } catch (error) {
    res.render("listing/error.ejs", { error });
  }
};
module.exports.destroyReview = async (req, res) => {
  try {
    let { id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("message","You have to login");
    return res.redirect(`/listings/${id}`);
  }
};