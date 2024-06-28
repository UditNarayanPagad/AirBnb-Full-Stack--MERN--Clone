const User = require("../models/user");

module.exports.signUpForm = (req, res) => {
  res.render("listing/signUp.ejs", { message: req.flash("message") });
};
module.exports.signUp = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let newUser = new User({
      email,
      username,
    });
    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("message", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("message", error.message);
    res.redirect("/signUp");
  }
}
module,exports.logInForm = (req, res) => {
  res.render("listing/login.ejs", { message: req.flash("message") });
}
module.exports.logIn =  (req, res)=> {
  req.flash("message", "Welcome back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
}
module.exports.logOut = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next();
    }
    req.flash("message", "Logout Successfully");
    res.redirect("/listings");
  });
}