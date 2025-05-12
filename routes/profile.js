import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/auth/login");
    }

    res.render("profile", {
      title: "Profile",
      userId: req.session.user.userId,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: req.session.user.email,
      address: req.session.user.address,
      inHoboken: req.session.user.inHoboken,
      state: req.session.user.state,
      ratingAverage:
        req.session.user.ratingAverage?.toFixed(2) || "No Ratings Yet",
    });
  } catch (error) {
    console.error("Error rendering profile page:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/:id/rate", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  const toUserId = req.params.id;
  const fromUserId = req.session.user._id;
  const score = parseInt(req.body.score, 10);
  try {
    await usersData.addRating(toUserId, fromUserId, score);
    res.redirect(`/profile/${toUserId}`);
  } catch (e) {
    res.status(400).render("profile", { error: e });
  }
});

export default router;
