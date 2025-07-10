const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing.js');
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderhous";
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");



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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Home route
app.get("/", (req, res) => {
  res.send("Hi! I'm Banshita... welcome to this site");
});

app.get("/listings",wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
}));

//../listings/new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});


// Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
}));

//create route
app.post("/listings",wrapAsync(async (req,res,next)=>{
const newListing = new Listing(req.body.listing);
     await newListing.save();
       res.redirect("/listings");
})
);

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
  let{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
 let{id}=req.params;
 let deletedListing=await Listing.findByIdAndDelete(id);
 console.log("deletedListing");
 res.redirect("/listings");
})); 

// app.all("/{*any}", (req, res, next) => {
//   next(new ExpressError(404, "Page not Found!"));
// });

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something Went Wrong"} = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

 