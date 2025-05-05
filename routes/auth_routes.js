import { Router } from "express";
const router = Router();

// Render login page
router.get("/login", (req, res) => {
  res.render("loginPage");
});

// Render register page
router.get("/register", (req, res) => {
  res.render("register");
});

export default router;
