import express from "express";
const router = express.Router();
import xss from 'xss';
import help, { checkId } from "../helpers.js";
import posts from "../data/posts.js"
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid'

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


router.get("/vehicleListings", async (req, res) => {
  try {
    const allPosts = await posts.getAllPosts();
    res.render("vehicleListings", {
      title: "Available Vehicles",
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
.get("/createListing", async (req, res) => {
  res.render("createListing", { title: "Create Listing" });
})
.post("/createListing", upload.single('image'), async (req, res) => {
  //console.log(req)
  try{
    if (!req.file) {
      throw "Image upload failed";
    }

    const imagePath = '/public/uploads/' + req.file.filename;

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
    let vehicleList = ["Scooter", "Skateboard", "Bicycle", "Other"]
    if(!vehicleList.includes(vehicleType)){
      throw "Vehicle type must be one of: Scooter, Skateboard, Bicycle, Other"
    }
    let validTagList = ["None", "Off Road", "Electric", "Two Wheels", "Four Wheels", "New", "Modded"]
    if(!validTagList.includes(vehicleTags1) || !validTagList.includes(vehicleTags2) || !validTagList.includes(vehicleTags3)){
      throw "Vehicle tags must be among: None, Off Road, Electric, Two Wheels, Four Wheels, New, Modded"
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
      whenAvailable
    ); //need to implement when availible array

    res.redirect(`/listingDetails/${newPost._id}`); // redirect to the new post
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

router.get("/listingDetails/:id", async (req, res) => {
  try {
    req.params.id = checkId(req.params.id);
  } catch (e) {
    res.status(400).render("error", {
      title: "Error",
      error: "Invalid post id"
    });
  }
  try {
    const post = await posts.getPostById(req.params.id);
    res.render("listingDetails", {
      post: post,
      user: req.session.user
    })
  } catch (e) {
    res.status(400).render("listingDetails"), {
      error: e.toString()
    }
  }
});
router.post("/listingDetails/:id", async (req, res) => {
  try {
    posts.createComment(req.params.id, "temp username", "temp first name??", "temp last name??", req.body); // im ngl i dont know how to get the currently logged in users details, also why are we taking first and last name separately?
    res.redirect(req.originalUrl); // refresh page
  } catch (e) {
    res.status(400).render("listingDetails", {
      error: e.toString()
    })
  }
});

export default router;
