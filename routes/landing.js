import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let showTermsModal = false;

    // Only show modal if the user is logged in and hasn't accepted terms
    if (req.session.user && req.session.user.termsAccepted === false) {
      showTermsModal = true;
    }

    // If registration set showTerms flag, override (one-time)
    if (req.session.showTerms === true) {
      showTermsModal = true;
      req.session.showTerms = false;
    }

    res.render("landing", {
      title: "MicroMobile",
      user: req.session.user,
      showTermsModal,
    });
  } catch (error) {
    console.error("Error rendering landing page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
