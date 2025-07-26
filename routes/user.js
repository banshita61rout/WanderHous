const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {
    saveRedirectUrl
} = require("../middleware.js");
const userController = require("../controllers/callbackuser.js")


// for signup page
router.route("/signup")
    .get(userController.rendersignup)
    .post(wrapAsync(userController.signup));



//for login page
router.route("/login")
    .get(userController.renderlogin)
    .post(saveRedirectUrl, passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.successlogin);


//logout
router.get("/logout", userController.logout);

module.exports = router;