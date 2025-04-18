import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("landing", { title: "Welcome to MicroMobile" });
});

export default router;