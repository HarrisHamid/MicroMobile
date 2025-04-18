import express from "express";
const router = express.Router();

router.get("/profile", async (req, res) => {
  res.render("profile", { title: "Profile Page" });
});

export default router;