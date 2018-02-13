var express                 = require("express");
var app = express();
var bodyparser              = require("body-parser");
var mongoose                = require("mongoose");
var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var Campground              = require("./models/photodiary.js");
var seedDB                  = require("./seeds.js");
var Comment                 = require("./models/comment.js");
var User                    = require("./models/user.js");
var flash                   = require("connect-flash");
var methodOverride          = require("method-override");

//requiring routes
var commentRoutes           = require("./routes/comment.js");
var campgroundsRoutes       = require("./routes/campgrounds.js");
var indexRoutes             = require("./routes/index.js");

mongoose.connect("mongodb://harsh:harsh@ds225608.mlab.com:25608/photodiary");
// mongoose.connect("mongodb://localhost/photodiary");

app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());


// seedDB(); //seed the photo

//passport configuration
app.use(require("express-session")({
    secret:"again tesla is no.1 in the world!!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//use routes in express
app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);

//start a server

// app.listen(8080, '10.128.0.2', function(){
//   console.log("Server has started!!"); 
// });
app.listen(process.env.PORT,process.env.IP, function(){
  console.log("Server has started!!"); 
});