import express from "express";
const router = express.Router();

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
    });
  } catch (error) {
    console.error("Error rendering profile page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
