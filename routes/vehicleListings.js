import express from "express";
const router = express.Router();
import xss from "xss";
import help, { checkId } from "../helpers.js";
import posts from "../data/posts.js";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import { all } from "axios";
import { getUserByUserId } from "../data/users.js";
import { addRating } from "../data/users.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); //this is where we store our images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); //I'm seeing some stuff of including Date.now() to get a unique filename. Worth looking into.
    cb(null, uuidv4() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      //mimetype is basically the extension (.png -> image/png)
      cb(null, true); //allow upload
    } else {
      cb(new Error("Only PNG and JPEG images are allowed"), false); //reject upload
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // max filesize 5MB
});

router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    let allPosts;

    if (searchTerm && searchTerm.trim().length > 0) {
      allPosts = await posts.filterPostsByTitle(searchTerm.trim());
    } else {
      allPosts = await posts.getAllPosts();
    }

    res.render("vehicleListings", {
      title: searchTerm ? `Results for "${searchTerm}"` : "Available Vehicles",
      posts: allPosts,
      vehicleTypes: ["Scooter", "Skateboard", "Bicycle", "Other"],
      otherTags: ["Electric", "Off Road", "Two Wheels", "Four Wheels", "New", "Modded", "Snow Gear", "Beach Gear"]
    })
  } catch (e) {
    res.status(500).render("error", {
      title: "Error",
      error: "Could not load vehicle listings"
    })
  }
});
router.get("/filterByTag", async (req, res) => {
  try {
    const tag = req.query.tag;
    const allPosts = await posts.filterPostsBySingleTag(tag);

    res.render("vehicleListings", {
      title: tag ? `Vehicles with tag: ${tag}` : "Available Vehicles",
      posts: allPosts,
      vehicleTypes: ["Scooter", "Skateboard", "Bicycle", "Other"],
      otherTags: ["Electric", "Off Road", "Two Wheels", "Four Wheels", "New", "Modded", "Snow Gear", "Beach Gear"]
    });
  } catch (e) {
    res.status(500).render("error", {
      title: "Error",
      error: "Could not filter vehicle listings by tag"
    });
  }
});
router.get("/vehicleListings", async (req, res) => {
  if (req.query.searchTerm && req.query.searchTerm.trim() !== "") {
    return res.redirect(`/vehicleListings/search?searchTerm=${encodeURIComponent(req.query.searchTerm)}`);
  }

  try {
    const allPosts = await posts.getAllPosts();
    res.render("vehicleListings", {
      title: "Available Vehicles",
      posts: allPosts,
      vehicleTypes: ["Scooter", "Skateboard", "Bicycle", "Other"],
      otherTags: ["Electric", "Off Road", "Two Wheels", "Four Wheels", "New", "Modded", "Snow Gear", "Beach Gear"]
      // User: req.session.user
    });
  } catch (e) {
    res.status(500).render("error", {
      title: "Error",
      error: "Could not load vehicle listings",
    });
  }
});
router
  .get("/requestVehicle", async (req, res) => {
    try {
      //if(!req.session.user)throw "You must be logged in to see this page"
      // req.session.user.lastPostChecked = xss(req.body.lastPostChecked)
      // if(!ObjectId.isValid(req.session.user.lastPostChecked)){throw "Error with getting last post checked data"};
      res.render("requestVehicle", { title: "Request Vehicle" }); //maybe this should be done as a partial on the vehicleDetails page
    } catch (e) {
      res.status(400).render("requestVehicle", {
        title: "Request Vehicle",
        error: e,
        data: req.body,
      });
    }
  })
  .post("/requestVehicle", async (req, res) => {
    //console.log(req)
    try {
      //if(!req.session.user) throw "You must be logged in to use see this page"
      //if(!req.session.user.lastPostChecked || !ObjectId.isValid(req.session.user.lastPostChecked)){throw "Error with getting last post checked data"};
      let extraComments = xss(req.body.extraComments);
      let start = xss(req.body.startDate);
      let end = xss(req.body.endDate);
      //res.json({extraComments: extraComments, startDate: startDate, endDate: endDate})
      if (typeof extraComments !== "string")
        throw "Extra Comments must be a string";
      start = help.checkString(start, "startDate");
      end = help.checkString(end, "endDate");
      //res.json({extraComments: extraComments, startDate: startDate, endDate: endDate})

      let startDate = new Date(start);
      let endDate = new Date(end);
      if (startDate == "Invalid Date" || endDate == "Invalid Date") {
        throw "Invalid start or end date";
      }
      //let newInsert = await posts.createRequest(req.session.user.lastPostChecked, extraComments, start, end)
      // res.status(200).render(`/vehicleDetails/${req.session.user.lastPostChecked}`, {requestSuccessful: true})
      //res.json({completion: "Needs to be integrated"})
      res.render("createListing", { layouts: null });
    } catch (e) {
      res.status(400).render("requestVehicle", {
        title: "Request Vehicle",
        error: e,
        data: req.body,
      });
    }
  });

router
  .get("/createListing", async (req, res) => {
    res.render("createListing", { title: "Create Listing" });
  })
  .post("/createListing", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        throw "Image upload failed";
      }

      const imagePath = "/public/uploads/" + xss(req.file.filename);

      let postTitle = xss(req.body.postTitle);
      let vehicleType = xss(req.body.vehicleType);
      let vehicleTags1 = xss(req.body.vehicleTags1);
      let vehicleTags2 = xss(req.body.vehicleTags2);
      let vehicleTags3 = xss(req.body.vehicleTags3);
      let protectionIncluded = xss(req.body.protectionIncluded);
      let vehicleCondition = xss(req.body.vehicleCondition);
      let maxRentalHours = xss(req.body.maxRentalHours);
      let maxRentalDays = xss(req.body.maxRentalDays);
      let hourlyCost = xss(req.body.hourlyCost);
      let dailyCost = xss(req.body.dailyCost);

      let posterUsername = "Jack1!"; //xss(req.session.user.posterUserame);
      let posterName = "Jack"; //xss(req.session.user.posterName);

      postTitle = help.checkString(postTitle, "post title");
      if (postTitle.length < 2) {
        throw "The title must be at least two characters long";
      }
      let vehicleList = ["Scooter", "Skateboard", "Bicycle", "Other"];
      if (!vehicleList.includes(vehicleType)) {
        throw "Vehicle type must be one of: Scooter, Skateboard, Bicycle, Other";
      }

      let validTagList = [
        "None",
        "Off Road",
        "Electric",
        "Two Wheels",
        "Four Wheels",
        "New",
        "Modded",
        "Snow Gear",
        "Beach Gear"
      ];

      if (
        !validTagList.includes(vehicleTags1) ||
        !validTagList.includes(vehicleTags2) ||
        !validTagList.includes(vehicleTags3)
      ) {
        throw "Vehicle tags must be among: None, Off Road, Electric, Two Wheels, Four Wheels, New, Modded, Snow Gear, Beach Gear";
      }
      let vehicleTags = [vehicleTags1, vehicleTags2, vehicleTags3];

      if (protectionIncluded !== "yes" && protectionIncluded !== "no") {
        throw "protectionIncluded must be yes or no";
      }

      vehicleCondition = help.checkCondition(vehicleCondition);
      let tempArr = help.checkMaxRental(maxRentalHours, maxRentalDays);
      maxRentalHours = tempArr[0];
      maxRentalDays = tempArr[1];
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
      return res.redirect(`/vehicleListings/listingDetails/${newPost._id}`); // redirect to the new post
    } catch (e) {
      return res.status(400).render("createListing", {
        title: "Create Listing",
        error: e.toString(),
        data: req.body,
      });
    }
    return res.render("profile", { title: "Create Listing" }); //render their profile at the end so they can see their listings, including the newest one
  });

router.get("/listingDetails/:id", async (req, res) => {
  try {
    req.params.id = checkId(req.params.id);
  } catch (e) {
    res.status(400).render("error", {
      title: "Error",
      error: "Invalid post id",
    });
  }
  try {
    const post = await posts.getPostById(req.params.id);
    let posterStats = { ratingAverage: 0, ratingCount: 0 };
    try {
      posterStats = await getUserByUserId(post.posterUsername);
      posterStats.ratingAverage = Number(posterStats.ratingAverage.toFixed(1));
    } catch (e) {
      console.warn("Couldn’t fetch poster ratings:", e);
    }
    res.render("listingDetails", {
      post: post,
      user: req.session.user,
      posterStats
    });
  } catch (e) {
    res.status(400).render("listingDetails"),
      {
        error: e.toString(),
      };
  }
});
router.post("/listingDetails/:id", async (req, res) => {
  try {
    await posts.createComment(
      req.params.id,
      req.session.user.userId,
      req.session.user.firstName,
      req.session.user.lastName,
      req.body.comment
    ); 
    res.redirect(req.originalUrl); // refresh page
  } catch (e) {
    res.status(400).render("listingDetails", {
      post,
      user: req.session.user,
      posterStats,
      error: e.toString(),
    });
  }
});
router.post("/listingDetails/:id/rate", async (req, res) => {
  try {
    const listingId    = checkId(req.params.id);
    const score        = Number(req.body.ratingInput);
    const post         = await posts.getPostById(listingId);

    const toUser       = await getUserByUserId(post.posterUsername);
    const fromUser     = await getUserByUserId(req.session.user.userId);
    if (!toUser || !fromUser) {
      throw "User not found";
    }
    await addRating(toUser._id.toString(), fromUser._id.toString(), score);
    return res.redirect(`/vehicleListings/listingDetails/${listingId}`);
  } catch (e) {
    const listingId = checkId(req.params.id);
    const post = await posts.getPostById(listingId);
    const posterStats = await getUserByUserId(post.posterUsername).catch(() => null);
    return res.status(400).render("listingDetails", {
      post,
      user: req.session.user,
      posterStats,
      error: e.toString()
    });
  }
});

export default router;
