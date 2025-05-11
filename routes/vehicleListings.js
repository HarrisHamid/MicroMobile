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
    cb(null, 'public/uploads/'); //this is where we store our images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); //I'm seeing some stuff of including Date.now() to get a unique filename. Worth looking into.
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') { //mimetype is basically the extension (.png -> image/png)
      cb(null, true); //allow upload
    } else {
      cb(new Error('Only PNG and JPEG images are allowed'), false); //reject upload
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
  try{
    
    if (!req.file) {
      throw "Image upload failed";
    }
    

    const imagePath = '/public/uploads/' + xss(req.file.filename);

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
    let whenAvailableFake = xss(req.body.whenAvailable);
    whenAvailableFake = whenAvailableFake.split(",");

    let posterUsername = 'Jack1!'//xss(req.session.user.posterUserame);
    let posterName = "Jack" //xss(req.session.user.posterName);
    

  
    postTitle = help.checkString(postTitle, "post title");
    if(postTitle.length < 2){
      throw "The title must be at least two characters long"
    }
    let vehicleList = ["scooter", "skateboard", "bicycle", "other"]
    if(!vehicleList.includes(vehicleType)){
      throw "Please use the form submission on /createlisting instead of submitting your own."
    }
    let validTagList = ["none", "offRoad", "electric", "2wheel", "4wheel", "new", "modded"]
    if(!validTagList.includes(vehicleTags1) || !validTagList.includes(vehicleTags2) || !validTagList.includes(vehicleTags3)){
      throw "Please use the form submission on /createlisting instead of submitting your own."
    }
    let vehicleTags = [vehicleTags1, vehicleTags2, vehicleTags3];

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

    const idMap = { //lmfao the enumerator is back. remember to collapse this lol
      m0: 0,
      m1: 1,
      m2: 2,
      m3: 3,
      m4: 4,
      m5: 5,
      m6: 6,
      m7: 7,
      m8: 8,
      m9: 9,
      m10:10,
      m11:11,
      m12:12,
      m13:13,
      m14:14,
      m15:15,
      m16:16,
      m17:17,
      m18:18,
      m19:19,
      m20:20,
      m21:21,
      m22:22,
      m23:23,
  
      t0: 24,
      t1: 25,
      t2: 26,
      t3: 27,
      t4: 28,
      t5: 29,
      t6: 30,
      t7: 31,
      t8: 32,
      t9: 33,
      t10:34,
      t11:35,
      t12:36,
      t13:37,
      t14:38,
      t15:39,
      t16:40,
      t17:41,
      t18:42,
      t19:43,
      t20:44,
      t21:45,
      t22:46,
      t23:47,
  
      w0: 48,
      w1: 49,
      w2: 50,
      w3: 51,
      w4: 52,
      w5: 53,
      w6: 54,
      w7: 55,
      w8: 56,
      w9: 57,
      w10:58,
      w11:59,
      w12:60,
      w13:61,
      w14:62,
      w15:63,
      w16:64,
      w17:65,
      w18:66,
      w19:67,
      w20:68,
      w21:69,
      w22:70,
      w23:71,
  
      h0: 72,
      h1: 73,
      h2: 74,
      h3: 75,
      h4: 76,
      h5: 77,
      h6: 78,
      h7: 79,
      h8: 80,
      h9: 81,
      h10:82,
      h11:83,
      h12:84,
      h13:85,
      h14:86,
      h15:87,
      h16:88,
      h17:89,
      h18:90,
      h19:91,
      h20:92,
      h21:93,
      h22:94,
      h23:95,
  
      f0: 96,
      f1: 97,
      f2: 98,
      f3: 99,
      f4: 100,
      f5: 101,
      f6: 102,
      f7: 103,
      f8: 104,
      f9: 105,
      f10:106,
      f11:107,
      f12:108,
      f13:109,
      f14:110,
      f15:111,
      f16:112,
      f17:113,
      f18:114,
      f19:115,
      f20:116,
      f21:117,
      f22:118,
      f23:119,
  
      s0: 120,
      s1: 121,
      s2: 122,
      s3: 123,
      s4: 124,
      s5: 125,
      s6: 126,
      s7: 127,
      s8: 128,
      s9: 129,
      s10:130,
      s11:131,
      s12:132,
      s13:133,
      s14:134,
      s15:135,
      s16:136,
      s17:137,
      s18:138,
      s19:139,
      s20:140,
      s21:141,
      s22:142,
      s23:143,
  
      u0: 144,
      u1: 145,
      u2: 146,
      u3: 147,
      u4: 148,
      u5: 149,
      u6: 150,
      u7: 151,
      u8: 152,
      u9: 153,
      u10:154,
      u11:155,
      u12:156,
      u13:157,
      u14:158,
      u15:159,
      u16:160,
      u17:161,
      u18:162,
      u19:163,
      u20:164,
      u21:165,
      u22:166,
      u23:167,
    }

    let whenAvailable = new Array(168).fill(0);
    for(let i in whenAvailableFake){
      whenAvailable[idMap[whenAvailableFake[i]]] = 1;
    }

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
      imagePath,//imagePath,
      whenAvailable 
    ); //need to implement when availible array
    return res.redirect(`/vehicleListings/listingDetails/${newPost._id}`); // redirect to the new post
  } catch(e) {
    return res.status(400).render("createListing", {
      title: "Create Listing",
      error: e.toString(),
      data: req.body
    });
  }
  return res.render("profile", { title: "Create Listing" }); //render their profile at the end so they can see their listings, including the newest one
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
    console.log(post);
    res.render("listingDetails", {
      post: post,
      user: req.session.user
    })
  } catch (e) {
    res.status(400).render("listingDetails"), {
      error: e.toString(),
      data: req.body
    }
  }
});

export default router;
