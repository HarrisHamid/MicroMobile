import express from "express";
const router = express.Router();
import {addRating, getUserByUserId} from "../data/users.js"
import postData from "../data/posts.js"
import xss from "xss";
import { checkStringIsGood, checkForNonSpace, checkExists, checkString, checkId, checkTitle, checkType, checkTags, checkCondition, checkAvailable, checkPosterUsername, checkPosterEmail,
    checkPosterName, checkMaxRental, checkCost, checkImage, checkWhenAvailable } from "../helpers.js"
import { ObjectId } from 'mongodb'

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/auth/login");
    }

    res.render("profile", {
      userId: req.session.user.userId,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: req.session.user.email,
      address: req.session.user.address,
      inHoboken: req.session.user.inHoboken,
      state: req.session.user.state,
      ratingAverage: req.session.user.ratingAverage?.toFixed(2) || "No Ratings Yet"
    });
  } catch (error) {
    console.error("Error rendering profile page:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post('/:id/rate', async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  const toUserId = xss(req.params.id);
  const fromUserId = req.session.user._id; //isn't it user.userId???
  const score = parseInt(xss(req.body.score), 10);
  try {
    await addRating(toUserId, fromUserId, score);
    res.redirect(`/profile/${toUserId}`);
  } catch (e) {
    res.status(400).render('profile', {error: e});
  }
});

router
.get('/getRequests', async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  try {
    const userId = req.session.user.userId;
    let data = await getUserByUserId(userId);
    res.json(data);
  } catch (e) {
    res.json(e)
  }
})
.post('/acceptRequest', async (req, res) => {
  console.log(req)
  try{
  let requestingUser = xss(req.body.requestingUser);
  let startDate = xss(req.body.startDate);
  let endDate = xss(req.body.endDate);
  let vehicleId = xss(req.body.vehicleId);
  let postTitle = xss(req.body.postTitle);
  postTitle = checkString(postTitle, "postTitle");
    requestingUser = checkString(requestingUser, "requestingUser");
    startDate = checkString(startDate, "startDate");
    endDate = checkString(endDate, "endDate");
    let startDate2 = new Date(startDate);
    let endDate2 = new Date(endDate);
    if (startDate2 == "Invalid Date" || endDate2 == "Invalid Date") {
        throw "Invalid start or end date";
    }
  if(typeof vehicleId !== "string" || !ObjectId.isValid(vehicleId)) throw "bad vehicleId";
  let requesterEmail = await postData.requestAccept(requestingUser, startDate, endDate, vehicleId)
  await postData.emailFunc(requesterEmail, req.session.user.email, true, startDate, endDate, postTitle)
  res.json({email: requesterEmail}) //basically reload the page
}catch (e) {console.log(e)}
})
.post('/denyRequest', async (req, res) => {
  console.log(req)
  try{
  let requestingUser = xss(req.body.requestingUser);
  let startDate = xss(req.body.startDate);
  let endDate = xss(req.body.endDate);
  let vehicleId = xss(req.body.vehicleId);
  let postTitle = xss(req.body.postTitle);
  postTitle = checkString(postTitle, "postTitle");
    requestingUser = checkString(requestingUser, "requestingUser");
    startDate = checkString(startDate, "startDate");
    endDate = checkString(endDate, "endDate");
    let startDate2 = new Date(startDate);
    let endDate2 = new Date(endDate);
    if (startDate2 == "Invalid Date" || endDate2 == "Invalid Date") {
        throw "Invalid start or end date";
    }
  if(typeof vehicleId !== "string" || !ObjectId.isValid(vehicleId)) throw "bad vehicleId";
  let requesterEmail = await postData.requestDeny(requestingUser, startDate, endDate, vehicleId)
  await postData.emailFunc(requesterEmail, req.session.user.email, false, startDate, endDate, postTitle)
  res.json({email: requesterEmail}) //basically reload the page
  }catch (e) {console.log(e)}
});

export default router;
