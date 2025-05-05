import { Router } from "express";
const router = Router();

// Render login page
router.get("/login", (req, res) => {
  let postList = await postsData.getAllPosts();
  //console.log(postList); //this prints successfully. Now we need vehicleListings to be ready to receive them.
  return res.render("vehicleListings", { title: "Listing Page" });
});

// Render register page
router.get("/register", (req, res) => {
  res.render("register");
});

export default router;
