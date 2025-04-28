import express from "express";
const router = express.Router();
import xss from 'xss';
import help from "../helpers.js";
import posts from "../data/posts.js"

router.get("/vehcileListings", async (req, res) => {
  res.render("vehcileListings", { title: "Listing Page" });
});

router
.get("/createListing", async (req, res) => {
  res.render("createListing", { title: "Create Listing" });
})
.post("/createListing", async (req, res) => {
  try{
    let postTitle = xss(req.body.postTitle)
    let vehicleType = xss(req.body.vehicleType)
    let vehicleTags1 = xss(req.body.vehicleTags1)
    let vehicleTags2 = xss(req.body.vehicleTags2)
    let vehicleTags3 = xss(req.body.vehicleTags3)
    let protectionIncluded = xss(req.body.protectionIncluded);
    let vehicleCondition = xss(req.body.vehicleCondition)
    let maxRentalHours = xss(req.body.maxRentalHours)
    let maxRentalDays = xss(req.body.maxRentalDays)
    let hourlyCost = xss(req.body.hourlyCost)
    let dailyCost = xss(req.body.dailyCost)

    let posterUsername = xss(req.session.user.posterUserame);
    let posterName = xss(req.session.user.posterName);
  
    postTitle = help.checkString(postTitle, "post title");
    if(postTitle.length < 2){
      throw "The title must be at least two characters long"
    }
    let vehicleList = ["scooter", "skateboard", "bicycle", "other"]
    if(!vehicleList.includes(vehicleType)){
      throw "Please use the form submission on /createlisting instead of submitting your own."
    }
    let validTagList = ["none", "offroad", "electric", "2wheel", "4wheel", "new", "modded"]
    if(!validTagList.includes(vehicleTags1) || !validTagList.includes(vehicleTags2) || !validTagList.includes(vehicleTags3)){
      throw "Please use the form submission on /createlisting instead of submitting your own."
    }
    let vehicleTags = [vehicleTags1, vehicleTags1, vehicleTags3];

    if(protectionIncluded !== "yes" && protectionIncluded !== "no"){
      throw "protectionIncluded must be yes or no"
    }

    vehicleCondition = help.checkCondition(vehicleCondition);
    let tempArr = help.checkMaxRental(maxRentalHours, maxRentalDays);
    maxRentalHours = tempArr[0];
    maxRentalDays  = tempArr[1];
    let tempArr2 = help.checkCost(hourlyCost, dailyCost);
    hourlyCost = tempArr2[0];
    dailyCost = tempArr2[1];

    let isCreated = posts.createPost(postTitle, vehicleType, vehicleTags, vehicleCondition, posterUsername, posterName, maxRentalHours, maxRentalDays, hourlyCost, dailyCost, undefined, undefined) //need to implement images and the when availible array
    res.render(undefined) //make this a specific vehicle page when we have that done
  }
  catch(e){
    res.status(400).render(error)
  }
  res.render("profile", { title: "Create Listing" }); //render their profile at the end so they can see their listings, including the newest one
})
;


export default router;
