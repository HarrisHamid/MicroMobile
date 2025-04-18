import express from "express";
const router = express.Router();

router.get("/vehcileListings", async (req, res) => {
  res.render("vehcileListings", { title: "Listing Page" });
});

export default router;
