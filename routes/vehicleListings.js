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
import { title } from "process";

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
    const searchTerm = xss(req.query.searchTerm);
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
      otherTags: [
        "Electric",
        "Off Road",
        "Two Wheels",
        "Four Wheels",
        "New",
        "Modded",
        "Snow Gear",
        "Beach Gear",
      ],
    });
  } catch (e) {
    res.status(500).render("error", {
      title: "Error",
      error: "Could not load vehicle listings",
    });
  }
});
router.get("/filterByTag", async (req, res) => {
  try {
    const tag = xss(req.query.tag);
    const allPosts = await posts.filterPostsBySingleTag(tag);

    res.render("vehicleListings", {
      title: tag ? `Vehicles with tag: ${tag}` : "Available Vehicles",
      posts: allPosts,
      vehicleTypes: ["Scooter", "Skateboard", "Bicycle", "Other"],
      otherTags: [
        "Electric",
        "Off Road",
        "Two Wheels",
        "Four Wheels",
        "New",
        "Modded",
        "Snow Gear",
        "Beach Gear",
      ],
    });
  } catch (e) {
    res.status(500).render("error", {
      title: "Error",
      error: "Could not filter vehicle listings by tag",
    });
  }
});
router.get("/vehicleListings", async (req, res) => {
  if (req.query.searchTerm && req.query.searchTerm.trim() !== "") {
    return res.redirect(
      `/vehicleListings/search?searchTerm=${encodeURIComponent(
        req.query.searchTerm
      )}`
    );
  }

  try {
    const allPosts = await posts.getAllPosts();
    res.render("vehicleListings", {
      title: "Available Vehicles",
      posts: allPosts,
      vehicleTypes: ["Scooter", "Skateboard", "Bicycle", "Other"],
      otherTags: [
        "Electric",
        "Off Road",
        "Two Wheels",
        "Four Wheels",
        "New",
        "Modded",
        "Snow Gear",
        "Beach Gear",
      ],
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
  .post("/requestVehicleGet", async (req, res) => {
    //GET is done as a POST so I can have a req.body
    
    try {
      if (!req.session.user) throw "You must be logged in to see this page";
      let postId = xss(req.body.postId);
      if (!ObjectId.isValid(postId)) {
        throw "Error with getting post ID";
      }
      res.render("requestVehicle", { layout: null, postId: postId }); //maybe this should be done as a partial on the vehicleDetails page
    } catch (e) {
      console.log(e)
      res.status(400).render("requestVehicle", {
        layout: null,
        title: "Request Vehicle",
        error: e,
        data: req.body,
      });
    }
  })
  .post("/requestVehicle", async (req, res) => {
    
    try {
      let a = req.body;
      if (
        a.extraComments === undefined ||
        !a.startDate ||
        !a.endDate ||
        !a.vehicleId
      )
        throw "Must have all inputs";
      if (!req.session.user) throw "You must be logged in to use see this page";
      var vehicleId = xss(req.body.vehicleId);
      if (!ObjectId.isValid(vehicleId)) {
        throw "Error with getting post id";
      }
      let extraComments = xss(req.body.extraComments);
      let start = xss(req.body.startDate);
      let end = xss(req.body.endDate);

      if (typeof extraComments !== "string")
        throw "Extra Comments must be a string";
      start = help.checkString(start, "startDate");
      end = help.checkString(end, "endDate");

      let startDate = new Date(start);
      let endDate = new Date(end);
      if (startDate == "Invalid Date" || endDate == "Invalid Date") {
        throw "Invalid start or end date";
      }
      let checkReq = await posts.checkRequest(
        req.session.user.userId,
        vehicleId,
        extraComments,
        start,
        end
      );
      console.log(checkReq)
      if (checkReq.hours) {
        res.render("payment", {
          layout: null,
          title: "Payment",
          data: {
            vehicleId: vehicleId,
            extraComments: extraComments,
            startDate: start,
            endDate: end,
            hours: checkReq.hours, 
            costPerHour: checkReq.costPerHour,
            cost: checkReq.cost,
          },
        });
      } else {
        res.render("payment", {
          layout: null,
          title: "Payment",
          data: {
            vehicleId: vehicleId,
            extraComments: extraComments,
            startDate: start,
            endDate: end,
            days: checkReq.days,
            costPerDay: checkReq.costPerDay,
            cost: checkReq.cost,
          },
        });
      }
      // const post = await posts.getPostById(vehicleId);
      // res.render("listingDetails", {
      //   post: post,
      //   user: req.session.user,
      //   requestSuccessful: true
      // });
    } catch (e) {
      console.log(e)
      res.json({error: e});
    }
  })
  .post("/payment", async (req, res) => {
    
    try {
      let a = req.body;
      if (a.extraComments === undefined || !a.startDate || !a.endDate)
        throw "Must have all inputs";
      if (!req.session.user) throw "You must be logged in to use see this page";
      let vehicleId = xss(req.body.vehicleId);
      if (!ObjectId.isValid(vehicleId)) {
        throw "Error with getting post id";
      }
      let extraComments = xss(req.body.extraComments);
      let start = xss(req.body.startDate);
      let end = xss(req.body.endDate);

      if (typeof extraComments !== "string")
        throw "Extra Comments must be a string";
      start = help.checkString(start, "startDate");
      end = help.checkString(end, "endDate");

      let startDate = new Date(start);
      let endDate = new Date(end);
      if (startDate == "Invalid Date" || endDate == "Invalid Date") {
        throw "Invalid start or end date";
      }

      //=======================
      // firstName validation
      //=======================
      const firstName = a.firstName;

      // Check if firstName is empty
      if (firstName.length === 0) {
        throw "First name cannot be empty";
      }
      // Regex check for lettters only
      if (!/^[a-zA-Z]+$/.test(firstName)) {
        throw "First name can only contain letters";
      }
      // Check length
      if (firstName.length < 2 || firstName.length > 20) {
        throw "First name must be between 2-20 characters";
      }

      //=======================
      // lastName validation
      //=======================
      const lastName = a.lastName;
      // Check if lastName is empty
      if (lastName.length === 0) {
        throw "Last name cannot be empty";
      }
      // Regex check for lettters only
      if (!/^[a-zA-Z]+$/.test(lastName)) {
        throw "Last name can only contain letters";
      }
      // Check length
      if (lastName.length < 2 || lastName.length > 20) {
        throw "Last name must be between 2-20 characters";
      }

      //=======================
      // address validation
      //=======================
      const address = a.address;
      // Check if favoriteQuote is empty
      if (address.length === 0) {
        throw "Address cannot be empty";
      }
      // Lenght check
      if (address.length < 10) {
        throw "Address must be at least 10 characters long";
      }

      //=======================
      // city validation
      //=======================
      const city = a.city;
      // Check if city is empty
      if (city.length === 0) {
        throw "City cannot be empty";
      }
      // Regex check for lettters only
      if (!/^[a-zA-Z]+$/.test(city)) {
        throw "City can only contain letters";
      }

      //=======================
      // state validation
      //=======================
      const state = a.state;
      // Check if state is empty
      if (state.length === 0) {
        throw "State cannot be empty";
      }
      // Regex check for lettters only
      if (!/^[a-zA-Z]+$/.test(state)) {
        throw "State can only contain letters";
      }
      //=======================
      // zipCode validation
      //=======================
      const zipCode = a.zipCode;
      // Check if zipCode is empty
      if (zipCode.length === 0) {
        throw "Zip Code cannot be empty";
      }
      // Regex check for 5 digits
      if (!/^\d{5}$/.test(zipCode)) {
        throw "Zip Code must be 5 digits";
      }
      //=======================
      // nameOnCard validation
      //=======================
      const nameOnCard = a.nameOnCard;
      // Check if nameOnCard is empty
      if (nameOnCard.length === 0) {
        throw "Name on Card cannot be empty";
      }
      // Regex check for lettters and spaces only
      if (!/^[a-zA-Z\s]+$/.test(nameOnCard)) {
        throw "Name on Card can only contain letters and spaces";
      }
      //=======================
      // cardNumber validation
      //=======================
      const cardNumber = a.cardNumber;
      // Check if cardNumber is empty
      if (cardNumber.length === 0) {
        throw "Card Number cannot be empty";
      }
      // Regex check for 15 or 16 digits
      if (!/^\d{15,16}$/.test(cardNumber)) {
        throw "Card Number must be 15 or 16 digits";
      }
      //=======================
      // expirationDate validation
      //=======================
      const expirationDate = a.formExpiration;
      // Check if expirationDate is empty
      if (expirationDate.length === 0) {
        throw "Expiration Date cannot be empty";
      }
      // Regex check for MM/YY format
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
        throw "Expiration Date must be in MM/YY format";
      }
      //=======================
      // CVV validation
      //=======================
      const cvv = a.CVV;
      // Check if CVV is empty
      if (cvv.length === 0) {
        throw "CVV cannot be empty";
      }
      // Regex check for 3 or 4 digits
      if (!/^\d{3,4}$/.test(cvv)) {
        throw "CVV must be 3 or 4 digits";
      }
      let createRequest = await posts.createRequest(
        req.session.user.userId,
        vehicleId,
        extraComments,
        start,
        end
      );
      
      res.redirect(`/vehicleListings/listingDetails/${vehicleId}`);
      // const post = await posts.getPostById(vehicleId);
      // res.render("listingDetails", {
      //   post: post,
      //   user: req.session.user,
      //   requestSuccessful: true
      // });
    } catch (e) {
      console.log(e)
      res.status(400).render("payment", {
        layout: null,
        error: e,
        title: "Payment",
        data: req.body,
      });
    }
  });

router
  .get("/createListing", async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/auth/login");
    }
    res.render("createListing", { title: "Create Listing" });
  })
  .post("/createListing", upload.single("image"), async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/auth/login");
    }
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
      let location = xss(req.body.location);
      let whenAvailableFake = xss(req.body.whenAvailable);
      whenAvailableFake = whenAvailableFake.split(",");
      let description = xss(req.body.description);

      let posterUsername = xss(req.session.user.userId);
      let posterName = `${xss(req.session.user.firstName)} ${xss(
        req.session.user.lastName
      )}`;

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
        "Beach Gear",
      ];

      if (
        !validTagList.includes(vehicleTags1) ||
        !validTagList.includes(vehicleTags2) ||
        !validTagList.includes(vehicleTags3)
      ) {
        throw "Vehicle tags must be among: None, Off Road, Electric, Two Wheels, Four Wheels, New, Modded, Snow Gear, Beach Gear";
      }
      let vehicleTags = [vehicleTags1, vehicleTags2, vehicleTags3];
      vehicleTags = vehicleTags.filter((tag) => tag !== "None");

      if (protectionIncluded !== "yes" && protectionIncluded !== "no") {
        throw "protectionIncluded must be yes or no";
      }

      //check description
      if (description.length === 0) {
        accumulatedErrors.push("Make and model cannot be empty");
      }
      if (description.length < 2) {
        accumulatedErrors.push("Make and model must be at least 2 characters");
      }

      // vehicleCondition = help.checkCondition(vehicleCondition);
      // let tempArr = help.checkMaxRental(maxRentalHours, maxRentalDays);
      // maxRentalHours = tempArr[0];
      // maxRentalDays = tempArr[1];
      // let tempArr2 = help.checkCost(hourlyCost, dailyCost);
      // hourlyCost = tempArr2[0];
      // dailyCost = tempArr2[1];

      vehicleCondition = help.checkCondition(vehicleCondition);
      let tempArr = help.checkMaxRental(maxRentalHours, maxRentalDays);
      maxRentalHours = tempArr[0];
      maxRentalDays = tempArr[1];
      let tempArr2 = help.checkCost(hourlyCost, dailyCost);
      hourlyCost = tempArr2[0];
      dailyCost = tempArr2[1];
      if((maxRentalHours == 0 || hourlyCost == 0) && maxRentalHours != hourlyCost){
        throw "if max rental hours or hourly cost are 0, the other must also be 0"
      }
      if((maxRentalDays == 0 || dailyCost == 0) && maxRentalDays != dailyCost){
        throw "if max rental day or daily cost are 0, the other must also be 0"
      }

      const idMap = {
        //lmfao the enumerator is back. remember to collapse this lol
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
        m10: 10,
        m11: 11,
        m12: 12,
        m13: 13,
        m14: 14,
        m15: 15,
        m16: 16,
        m17: 17,
        m18: 18,
        m19: 19,
        m20: 20,
        m21: 21,
        m22: 22,
        m23: 23,

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
        t10: 34,
        t11: 35,
        t12: 36,
        t13: 37,
        t14: 38,
        t15: 39,
        t16: 40,
        t17: 41,
        t18: 42,
        t19: 43,
        t20: 44,
        t21: 45,
        t22: 46,
        t23: 47,

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
        w10: 58,
        w11: 59,
        w12: 60,
        w13: 61,
        w14: 62,
        w15: 63,
        w16: 64,
        w17: 65,
        w18: 66,
        w19: 67,
        w20: 68,
        w21: 69,
        w22: 70,
        w23: 71,

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
        h10: 82,
        h11: 83,
        h12: 84,
        h13: 85,
        h14: 86,
        h15: 87,
        h16: 88,
        h17: 89,
        h18: 90,
        h19: 91,
        h20: 92,
        h21: 93,
        h22: 94,
        h23: 95,

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
        f10: 106,
        f11: 107,
        f12: 108,
        f13: 109,
        f14: 110,
        f15: 111,
        f16: 112,
        f17: 113,
        f18: 114,
        f19: 115,
        f20: 116,
        f21: 117,
        f22: 118,
        f23: 119,

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
        s10: 130,
        s11: 131,
        s12: 132,
        s13: 133,
        s14: 134,
        s15: 135,
        s16: 136,
        s17: 137,
        s18: 138,
        s19: 139,
        s20: 140,
        s21: 141,
        s22: 142,
        s23: 143,

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
        u10: 154,
        u11: 155,
        u12: 156,
        u13: 157,
        u14: 158,
        u15: 159,
        u16: 160,
        u17: 161,
        u18: 162,
        u19: 163,
        u20: 164,
        u21: 165,
        u22: 166,
        u23: 167,
      };

      let whenAvailable = new Array(168).fill(0);
      for (let i in whenAvailableFake) {
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
        location, //WE NEED THE LOCATION HERE I THINK
        imagePath,
        whenAvailable,
        protectionIncluded,
        description
      ); //need to implement when availible array
      return res.redirect(`/vehicleListings/listingDetails/${newPost._id}`); // redirect to the new post
    } catch (e) {
      console.log(e)
      return res.status(400).render("createListing", {
        title: "Create Listing",
        error: e.toString(),
        data: req.body,
      });
    }
  });

router.get("/listingDetails/:id", async (req, res) => {
  try {
    req.params.id = checkId(xss(req.params.id));
  } catch (e) {
    res.status(400).render("error", {
      title: "Error",
      error: "Invalid post id",
    });
  }
  try {
    const post = await posts.getPostById(xss(req.params.id));
    

    let posterStats = { ratingAverage: 0, ratingCount: 0 };
    let allowRating = false;
    try {
      posterStats = await getUserByUserId(post.posterUsername);
      posterStats.ratingAverage = Number(posterStats.ratingAverage.toFixed(1));
      allowRating =
        req.session.user &&
        posterStats.clients.includes(req.session.user.userId);
    } catch (e) {
      console.warn("Couldn’t fetch poster ratings:", e);
    }
    let calendar = []; //the whenAvailable array in an easily parsable format for handlbars
    let i = 0;
    for (let j = 0; j < 7; j++) {
      let the = [];
      for (let x = 0; x < 24; x++) {
        the.push(post.whenAvailable[i]);
        i++;
      }
      calendar.push(the);
    }
    for(let x in post.taken){
      let date = new Date(post.taken[x].startDate);
      let month = date.getMonth();
      month = (Number(month) + 1).toString();
      if(month.length === 1) month = ` ${month}`
      let day = date.getDate()
      if(day.length === 1) day = ` ${day}`
      let year = date.getFullYear()
      let hours = date.getHours()
      if(hours.length === 1) hours = ` ${hours}`
      let amPM = "AM";
      if(Number(hours) > 12) {hours = `${Number(hours) - 12}`; amPM = "PM"}
      let minutes = date.getMinutes()
      if(minutes.length === 1) minutes = ` ${minutes}`
      if(minutes == 0) minutes = "00"
      if(hours == 0) hours = "00"
    
      post.taken[x].startDate =  `${month}/${day}/${year} ${hours}:${minutes}${amPM}`;

          date = new Date(post.taken[x].endDate);
          month = date.getMonth();
          month = (Number(month) + 1).toString();
          if(month.length === 1) month = ` ${month}`
          day = date.getDate()
          if(day.length === 1) day = ` ${day}`
          year = date.getFullYear()
          hours = date.getHours()
          if(hours.length === 1) hours = ` ${hours}`
          amPM = "AM";
          if(Number(hours) > 12) {hours = `${Number(hours) - 12}`; amPM = "PM"}
          minutes = date.getMinutes()
          if(minutes.length === 1) minutes = ` ${minutes}`
          if(minutes == 0) minutes = "00"
          if(hours == 0) hours = "00"
          post.taken[x].endDate =  `${month}/${day}/${year} ${hours}:${minutes}${amPM}`;
    }
    //
    res.render("listingDetails", {
      title: post.postTitle + " Details",
      post: post,
      user: req.session.user,
      posterStats,
      calendar: calendar,
      allowRating,
    });
  } catch (e) {
    return res.status(500).render("error", {
      title: "Error",
      error: "A surprise error occurred",
    });
  }
});
router.post("/listingDetails/:id", async (req, res) => {
  try {
    await posts.createComment(
      xss(req.params.id),
      xss(req.session.user.userId),
      xss(req.session.user.firstName),
      xss(req.session.user.lastName),
      xss(req.body.comment)
    );

    res.redirect(req.originalUrl); // refresh page
  } catch (e) {
    res.status(400).render("listingDetails", {
      user: req.session.user,
      posterStats,
      error: e.toString(),
    });
  }
});
router.post("/listingDetails/:id/rate", async (req, res) => {
  try {
    const listingId = checkId(xss(req.params.id));
    const score = Number(xss(req.body.ratingInput));
    const post = await posts.getPostById(listingId);

    const toUser = await getUserByUserId(post.posterUsername);
    const fromUser = await getUserByUserId(req.session.user.userId);

    if (!toUser || !fromUser) {
      throw "User not found";
    }
    await addRating(toUser._id.toString(), fromUser._id.toString(), score);
    return res.redirect(`/vehicleListings/listingDetails/${listingId}`);
  } catch (e) {
    const listingId = checkId(xss(req.params.id));
    const post = await posts.getPostById(listingId);
    const posterStats = await getUserByUserId(post.posterUsername).catch(
      () => null
    );
    return res.status(400).render("listingDetails", {
      post,
      user: req.session.user,
      posterStats,
      error: e.toString(),
    });
  }
});

export default router;
