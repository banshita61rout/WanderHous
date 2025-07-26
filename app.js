if (process.nextTick.NODE_ENV != "production") {
  require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderhous";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");


async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {

    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //one week time(day+total hours + minutes + seconds + miliseconds)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Home route
app.get("/", (req, res) => {
  res.send("Hi! I'm Banshita... welcome to this site");
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// //demouser route to check autentication
// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username :"delta-student",
//   });

//   let registeredUser=await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", UserRouter);



// app.all("/{*any}", (req, res, next) => {
//   next(new ExpressError(404, "Page not Found!"));
// });

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });wrong method

app.use((err, req, res, next) => {
  let {
    statusCode = 500, message = "Something Went Wrong"
  } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});