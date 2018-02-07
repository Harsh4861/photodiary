
//=========
//AUTH ROUTES
//=========
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");

//home page
router.get("/", function(req, res){
   res.render("landing.ejs") ;
});
router.get("/register", function(req, res){
    res.render("register.ejs");
});
//Handle user sign up
router.post("/register", function(req, res){
var newUser=    new User({username:req.body.username});
   User.register(newUser,req.body.password, function(error,user){
       if(error){
           req.flash("error", error.message);
            res.redirect("/register");
          
            
       }else{
           passport.authenticate("local")(req, res ,function(){
                req.flash("success","Welcome to PhotoDiary, " + user.username);
               res.redirect("/diary");
           });
       }
   });
});

//Login
//render login
router.get("/login", function(req, res){
    res.render("login.ejs");
});

//login logic
 
router.post("/login",passport.authenticate("local",{
    
    successRedirect:"/diary",
    failureRedirect:"/login"
}), function(req, res){
    
    
});
//logout routes
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/diary");
});
//middleware

module.exports = router;