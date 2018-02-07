
//===========
//Comment routes
//===========
var express = require("express");
var router = express.Router();
var Campground = require("../models/photodiary.js");
var Comment = require("../models/comment");

//comment form
router.get("/diary/:id/comments/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong! ")
            console.log(err);
        }else{
            res.render("comments/new.ejs",{campground: campground});
        }
    });
    
});
//create a comment
router.post("/campground/:id/comments",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/diary");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.username= req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added Comment! ")
                    res.redirect('/diary/' + campground._id);
                }
            });
        }
    });
});
// Comment edit route
router.get("/diary/:id/comments/:comment_id/edit",checkcommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, edit){
        if(err){
            console.log(err);
            
        }else(
             res.render("./comments/commentEdit.ejs", {campground_id :req.params.id ,comment:edit})
            );
    });
   
});
//update route
router.put("/diary/:id/comments/:comment_id",checkcommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, found){
        if(err){
            req.flash("error", "Something went wrong")
            console.log("");
        }else(
            
            res.redirect("/diary/" + req.params.id)
            );
    });
});
router.delete("/diary/:id/comments/:comment_id",checkcommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, remove){
        if(err){
            req.flash("error", "Something went wrong")
            console.log(err);
        }else{
            req.flash("success", "Comment Successfully Deleted!")
            res.redirect("/diary/" + req.params.id);
        }
    });
    
})
//middleware
function checkcommentOwner(req, res, next){
     if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, found){
       if(err){
           req.flash("error", "Comment not found! ")
           console.log("back");
       }else{
           //does user own the campground
           if(found.author.id.equals(req.user._id)){
                next();
           }else{
               req.flash("error", "You don't have permission to that! ");
               res.redirect("back");
           }
          
       }
   });
    }else{
        res.redirect("back");
    }
}
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that! ")
    res.redirect("/login");
}
module.exports = router;