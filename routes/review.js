const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {validateReview, isloggedIn,isreviewAuthor} = require("../middleware.js");
const reviewController=require("../controllers/callbackreview.js");




//review post new one 
//comment Route
router.post("/",isloggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId",isloggedIn,isreviewAuthor, wrapAsync(reviewController.deleteReview))
module.exports = router;