//=========
//campgrounds
//=========
var express = require("express");
var router = express.Router();
var Campground = require("../models/photodiary.js");
// multer image upload
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter,
        limits:{fileSize: 30000000
    
}});

// setup clodinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'photodiary', 
  api_key:"168924283782911", 
  api_secret:"gIZ5Ug563uok7P6RZNtB3SN-XCQ"
});

//show all photo
router.get("/diary", function(req, res){
    
    Campground.find({},function(err, allcampground){
        if(err){
            req.flash("error", "Photo's not found!")
            console.log("something went wrong");
        }else{
                res.render("diary/index.ejs",{campgrounds:allcampground, currentUser:req.user});
        }
    });
    
});
//create a photo
router.post("/campgrounds",isLoggedIn,upload.single('image'), function(req, res){
    // var title=req.body.name;
    // var image=req.body.image;
    // var desc=req.body.description;
    // var author = {
    //     id:req.user._id,
    //     username:req.user.username
    // };
    // var results = {title:title, image:image,description:desc, author:author};
    // console.log(results);
    // Campground.create(results,function(err, newcampgroound)
    // {
    //     if(err){
    //         req.flash("error", "Something went wrong")
    //         console.log("something went wrong");
    //     }else{
    //         req.flash("success", "Photo uploaded successfully!")
    //         res.redirect("/diary");
    //     }
    // });
    cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.image = result.secure_url;
  // add author to campground
//   req.body.campground.author = {
//     id: req.user._id,
//     username: req.user.username
//   }
    var title=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    };
    var results = {title:title, image:image,description:desc, author:author};
  Campground.create(results, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    req.flash("success", "Photo uploaded successfully!")
    res.redirect('/diary');
  });
});
    
});
//photo form
router.get("/diary/new",isLoggedIn, function(req, res){
    res.render("diary/new.ejs");
});
//shows more info about one photo
router.get("/diary/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong")
            console.log(err);
        } else {
            //render show template with that campground
            res.render("diary/show.ejs", {campground: foundCampground});
        }
    });
});

router.get("/diary/:id/edit",checkDiaryOwner, function(req, res){
                Campground.findById(req.params.id, function(err, found){
                     res.render("diary/edit.ejs", {campground: found}); 
             });
});
router.put("/diary/:id",checkDiaryOwner, function(req, res){
    
    Campground.findByIdAndUpdate(req.params.id, req.body.diary, function(err, update){
        if(err){
            req.flash("error", "Something went wrong")
            res.redirect("/diary");
        }else{
            req.flash("success", "Photo Updated successfully!")
            res.redirect("/diary/" + req.params.id);
           
        }
    });
});

//destroy route
router.delete("/diary/:id",checkDiaryOwner, function(req, res){
    
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/diary");
        }else(
            
            res.redirect("/diary")
            );
    });
});
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged in to do that! ");
    res.redirect("/login");
}
function checkDiaryOwner(req, res, next){
     if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, found){
       if(err){
           req.flash("error", "Campground not found! ");
           console.log("back");
       }else{
           //does user own the campground
           if(found.author.id.equals(req.user._id)){
                next();
           }else{
               req.flash("error", "You don't have permission to do that! ")
               res.redirect("back");
           }
          
       }
   });
    }else{
        res.redirect("back");
    }
}
module.exports = router;