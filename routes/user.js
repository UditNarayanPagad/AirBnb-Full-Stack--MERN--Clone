const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

//signUpForm
router.get("/signUp", userController.signUpForm);

//signUp
router.post("/signUp", userController.signUp);

//loginForm
router.get("/login", userController.logInForm);

//login
router.post("/login",saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
 userController.logIn
);

//logout
router.get("/logout", userController.logOut);

module.exports = router;