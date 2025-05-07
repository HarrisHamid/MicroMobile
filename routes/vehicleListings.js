import express from "express";
const router = express.Router();
import xss from 'xss';
import help from "../helpers.js";
import posts from "../data/posts.js"
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid'
import {ObjectId} from 'mongodb';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPEG images are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // max filesize 5MB
});


router.get("/", async (req, res) => {
  try {
    const allPosts = await posts.getAllPosts();
    res.render("vehicleListings", {
      title: "Vehicle Listings",
      posts: allPosts
      // User: req.session.user
    });
  } catch (e) {
    res.status(500).render("error", {
      title: "Error",
      error: "Could not load vehicle listings"
    });
  }
});
router 
.get("/requestVehicle", async (req, res) =>{
  try{
  //if(!req.session.user)throw "You must be logged in to see this page"
  // req.session.user.lastPostChecked = xss(req.body.lastPostChecked)
  // if(!ObjectId.isValid(req.session.user.lastPostChecked)){throw "Error with getting last post checked data"};
  res.render("requestVehicle", {title: "Request Vehicle"}) //maybe this should be done as a partial on the vehicleDetails page
  }
  catch(e){
    res.status(400).render("requestVehicle", {
      title: "Request Vehicle",
      error: e,
      data: req.body
    });
  }
})
.post("/requestVehicle", async (req, res) =>{
  //console.log(req)
  try{
  //if(!req.session.user) throw "You must be logged in to use see this page"
  //if(!req.session.user.lastPostChecked || !ObjectId.isValid(req.session.user.lastPostChecked)){throw "Error with getting last post checked data"};
  let extraComments = xss(req.body.extraComments);
  let start = xss(req.body.startDate);
  let end = xss(req.body.endDate);
  //res.json({extraComments: extraComments, startDate: startDate, endDate: endDate})
  if(typeof extraComments !== "string") throw "Extra Comments must be a string";
  start = help.checkString(start, "startDate");
  end = help.checkString(end, "endDate");
  //res.json({extraComments: extraComments, startDate: startDate, endDate: endDate})

  let startDate = new Date(start);
  let endDate = new Date(end); 
  if(startDate == "Invalid Date" ||  endDate == "Invalid Date"){
    throw "Invalid start or end date"
  }
  //let newInsert = await posts.createRequest(req.session.user.lastPostChecked, extraComments, start, end)
  // res.status(200).render(`/vehicleDetails/${req.session.user.lastPostChecked}`, {requestSuccessful: true})
  //res.json({completion: "Needs to be integrated"})
  res.render("createListing", {layouts: null});
  }
  catch(e){
    res.status(400).render("requestVehicle", {
      title: "Request Vehicle",
      error: e,
      data: req.body
    });
  }
});

router
.get("/createListing", async (req, res) => {
  res.render("createListing", { title: "Create Listing" });
})
.post("/createListing", upload.single('image'), async (req, res) => {
  //console.log(req)
  try{
    if (!req.file) {
      throw "Image upload failed";
    }

    const imagePath = '/uploads/' + req.file.filename;

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

    let posterUsername = xss(req.session.user.posterUsername);
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

    let newPost = await posts.createPost(
      postTitle,
      vehicleType,
      vehicleTags,
      vehicleCondition, 
      posterUsername,
      posterName, 
      maxRentalHours,
      maxRentalDays,
      hourlyCost, 
      dailyCost,
      imagePath,
      undefined
    ); //need to implement when availible array

    res.redirect(`/posts/${newPost._id}`); // redirect to the new post
    //console.log("test");
  } catch(e) {
    //console.log("test2");
    res.status(400).render("createListing", {
      title: "Create Listing",
      error: e.toString(),
      data: req.body
    });
  }
  // res.render("profile", { title: "Create Listing" }); //render their profile at the end so they can see their listings, including the newest one
})
;


export default router;
