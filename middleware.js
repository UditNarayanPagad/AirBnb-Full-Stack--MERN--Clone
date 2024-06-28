let Review = require('./models/review.js');

function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
      }
      else{
        req.session.redirectUrl = req.originalUrl;
        req.flash("message","! You have to loggedin first");
        res.redirect("/login");
      }
}
module.exports = {isLoggedin};
module.exports.saveredirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
module.exports.isReviewedBy = async (req,res,next)=>{
  try {
    let {id , reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.curUser._id)){
    req.flash("message","You can't delete this review!!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
  } catch (error) {
    req.flash("message","You have to sign in first!!!");
    return res.redirect(`/listings/${id}`);
  }
}