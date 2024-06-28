if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const listings = require("./routes/listings.js");
const review = require("./routes/review.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");
const UserRoute = require("./routes/user.js"); 

main()
  .then(console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sessionOptions = {
  secret : "Super Secret",
  resave : false,
  saveUninitialized : true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
}
app.use(session(sessionOptions));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser("Cookies"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.messages = req.flash("success");
  res.locals.messages = req.flash("error");
  res.locals.curUser = req.user;
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/review", review);
app.use("/",UserRoute);


app.get("/", (req, res) => {
  // console.dir(req.cookies);    //cookies
  // console.dir(req.signedCookies);    //signed cookies
  // let {Name} = req.cookies;
  // res.send(`Hii ${Name}`);
  res.redirect("/listings");
});
app.get("/test", async (req, res) => {
  // let sample = new listing({
  //   title:"My Home",
  //   description:"This is Home",
  //   price:1200,
  //   location:"Goa",
  //   country:"India",
  // });
  // await sample.save();
  let out = await listing.find();
  res.send(out);
});

// app.get('/createUser',async (req,res)=>{
//   let newUser = new User({
//     email:"xyz@gmail.com",
//     username : "Xyzz",
//   });
//   let registeredUser = await User.register(newUser,"Password123");
//   res.send(registeredUser);
// });

//cookies
app.get("/getCookies", (req, res) => {
  res.cookie("Name", "Abc",{signed:true});
  res.send("Cookies Saved");
});

// app.all('*',(req,res,next)=>{
//   next("Page Not found");
// });

app.listen(8080, () => {
  console.log("Server is listing on port 8080");
});
