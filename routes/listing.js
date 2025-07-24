const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const {isloggedIn,isOwner,validateListing} = require("../middleware.js")


//index route
router.get("/", wrapAsync(async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", {
    alllistings
  });
}));

//../listings/new route
router.get("/new", isloggedIn, (req, res) => {
  res.render("listings/new.ejs");
});


// Show route
router.get("/:id", wrapAsync(async (req, res) => {
  const {
    id
  } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  //console.log(listing);
  res.render("listings/show", {
    listing
  });
}));

//create route
router.post("/",isloggedIn, validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", isloggedIn,isOwner, wrapAsync(async (req, res) => {
  let {
    id
  } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", {
    listing
  });
}));

//update route
router.put("/:id", isloggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
  let {
    id
  } = req.params;
  
  await Listing.findByIdAndUpdate(id, {
    ...req.body.listing
  });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));



//delete route
router.delete("/:id", isloggedIn,isOwner, wrapAsync(async (req, res) => {
  let {
    id
  } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("deletedListing");
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));
module.exports = router;