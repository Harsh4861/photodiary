var mongoose = require("mongoose");
var Campground = require("./models/photodiary.js");
var Comment = require("./models/comment.js");

var data =[
    {title:"Tesla Roadster",image:"https://cdn.teslarati.com/wp-content/uploads/2017/12/tesla-roadster-design-team-franz.jpg",description:"nice car!!!"},
    {title:"Iphone X",image:"https://www.imore.com/sites/imore.com/files/styles/xlarge_wm_blw/public/field/image/2017/10/iphone-x-multitasking.jpg?itok=xNLyvMs3",description:"nice phone!!!"},
    {title:"Thor",image:"http://www.comingsoon.net/assets/uploads/2017/10/thor-1.jpg",description:"Christopher Hemsworth (born 11 August 1983) is an Australian actor. He is known for playing Kim Hyde in the Australian TV series Home and Away (2004–07) and Thor in the Marvel Cinematic Universe since 2011. Hemsworth has also appeared in the science fiction action film Star Trek (2009), the thriller adventure A Perfect Getaway (2009), the horror comedy The Cabin in the Woods (2012), the dark-fantasy action film Snow White and the Huntsman (2012), the war film Red Dawn (2012), and the biographical sports drama film Rush (2013).In 2015, he starred in the action thriller film Blackhat, had a comedic role in the fifth installment of National Lampoon's Vacation series, Vacation, and headlined the biographical thriller film In the Heart of the Sea. The following year, Hemsworth had a supporting role in Sony's reboot of Ghostbusters. Hemsworth will reprise his role as George Kirk in the upcoming Star Trek sequel."},
    {title:"Taylor swift",image:"http://hdwallpaperz.us/wp-content/uploads/2017/04/3-59.jpg",description:"Taylor Alison Swift (born December 13, 1989) is an American singer-songwriter. One of the leading contemporary recording artists, she is known for narrative songs about her personal life, which have received widespread media coverage.Born and raised in Pennsylvania, Swift moved to Nashville, Tennessee at the age of 14 to pursue a career in country music. She signed with the label Big Machine Records and became the youngest artist ever signed by the Sony/ATV Music publishing house. Her self-titled debut album in 2006 peaked at number five on the Billboard 200 and spent the most weeks on the chart in the 2000s. The album's third single, Our Song, made her the youngest person to single-handedly write and perform a number-one song on the Hot Country Songs chart. Swift's second album, Fearless, was released in 2008. Buoyed by the success of pop crossover singles Love Story and You Belong with Me, Fearless became the best-selling album of 2009 in the United States. The album won four Grammy Awards, with Swift becoming the youngest Album of the Year winner."}
    ];
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log("something went wrong");
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
