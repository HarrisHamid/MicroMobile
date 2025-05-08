import { Router } from "express";
const router = Router();

// Render login page
router
  .route("/login")
  .get(async (req, res) => {
    try {
      const showTermsModal = req.session.showTerms === true;
      req.session.showTerms = false;
      res.render("loginPage", { showTermsModal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      let userId = xss(req.body.userId);
      let password = xss(req.body.password);

      // trimminging the inputs
      const trimmedUserId = userId.trim();
      const trimmedPassword = password.trim();

      // Check if all fields are filled
      if (!trimmedUserId || !trimmedPassword) {
        throw Error("All fields are required");
      }

      //========================
      // userId validation
      //========================
      // String Type Check
      if (typeof trimmedUserId !== "string") {
        throw Error(`userId must be of type String`);
      }
      // Empty just spaces check
      if (trimmedUserId.length === 0) {
        throw Error(`userId can't be empty or just spaces`);
      }
      // Regex Check for just letters or positive whole numbers
      if (!/^[a-zA-Z0-9]+$/.test(trimmedUserId)) {
        throw Error(`userId can only have letters or positive whole numbers`);
      }
      // Length Check
      if (trimmedUserId.length < 5) {
        throw Error(`userId must be at least 5 characters`);
      }

      //========================
      // password validation
      //========================
      // String Type Check
      if (typeof trimmedPassword !== "string") {
        throw Error(`password must be of type String`);
      }
      // Empty just spaces check
      if (trimmedPassword.length === 0) {
        throw Error(`password can't be empty or just spaces`);
      }
      // Length Check
      if (trimmedPassword.length < 8) {
        throw Error(`password must be at least 8 characters`);
      }
      // Password Constraints:
      if (!/[A-Z]/.test(trimmedPassword)) {
        throw Error(`password must contain at least one uppercase character`);
      }
      if (!/[0-9]/.test(trimmedPassword)) {
        throw Error(`password must contain at least one number`);
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmedPassword)) {
        throw Error(`password must contain at least one special character`);
      }

      // Check if userId and password match
      const userCollection = await users();
      const tempUser = await userCollection.findOne({ userId: trimmedUserId });
      if (
        !tempUser ||
        !(await bcrypt.compare(trimmedPassword, tempUser.password))
      ) {
        // invalid login
        return res.status(401).render("loginPage", {
          error: "Invalid userId or password",
        });
      }

      // session stuff
      const user = await login(trimmedUserId.toLowerCase(), trimmedPassword);
      console.log(user);
      req.session.user = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        inHoboken: user.inHoboken,
        state: user.state,
        role: user.role //same as above, I include the role here so our middleware can print it. -Jack
      };
      return res.redirect("/");
    } catch (error) {
      res.status(400).render("loginPage", {
        // render should be loginPage route should be login
        error: error.message,
      });
    }
  });

// Render signout
router.route("/signout").post(async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error while logging out.");
      }
      res.clearCookie("AuthenticationState");
      res.render("signout", {
        message: "You have been logged out successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
