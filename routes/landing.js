import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("landing", {
      title: "MicroMobile",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error rendering landing page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
