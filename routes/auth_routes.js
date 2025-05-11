import { Router } from "express";
import { register } from "../data/users.js";
import { login } from "../data/users.js";
import xss from "xss";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcryptjs";
const router = Router();

// Render register page
router
  .route("/register")
  .get(async (req, res) => {
    try {
      res.render("register");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

  .post(async (req, res) => {
    try {
      let firstName = xss(req.body.firstName);
      let lastName = xss(req.body.lastName);
      let userId = xss(req.body.userId);
      let password = xss(req.body.password);
      let confirmPassword = xss(req.body.confirmPassword);
      let email = xss(req.body.email);
      let address = xss(req.body.address);
      let inHoboken = xss(req.body.inHoboken);
      let state = xss(req.body.state || "");

      //Age check cause you never know
     if (!req.body.isAdult) {
       return res.status(400).render("register", {
         error: "You must confirm you are 18 years of age or older"
       });
     }

      // trimminging the inputs
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedUserId = userId.trim();
      const trimmedPassword = password.trim();
      const trimmedConfirmPassword = confirmPassword.trim();
      const trimmedEmail = email.trim();
      const trimmedAddress = address.trim();
      const trimmedInHoboken = inHoboken.trim().toLowerCase();
      const trimmedState = state.trim().toUpperCase();

      // Check if all fields are filled
      if (
        !firstName ||
        !lastName ||
        !userId ||
        !password ||
        !confirmPassword ||
        !email ||
        !address ||
        !inHoboken
      ) {
        return res.status(400).render("register", {
          error: "All fields are required",
        });
      }

      //========================
      // firstName validation
      //========================
      // String Type Check
      if (typeof trimmedFirstName !== "string") {
        throw Error(`First name must be of type String`);
      }
      //Empty and Just Spaces Check
      if (trimmedFirstName.length === 0) {
        throw Error(`First name cannot be empty or just be spaces`);
      }
      // Regex Check for just letters
      if (!/^[a-zA-Z]+$/.test(trimmedFirstName)) {
        throw Error(`First name must contain only letters`);
      }
      // Length Check
      if (trimmedFirstName.length < 2 || trimmedFirstName.length > 20) {
        throw Error(`First name must be between 2-20 characters`);
      }

      //========================
      // lastName validation
      //========================
      // String Type Check
      if (typeof trimmedLastName !== "string") {
        throw Error(`Last name must be of type String`);
      }
      // Empty just spaces check
      if (trimmedLastName.length === 0) {
        throw Error(`Last name must not be empty or just spaces`);
      }
      // Regex Check for just letters
      if (!/^[a-zA-Z]+$/.test(trimmedLastName)) {
        throw Error(`Last name must contain only letters`);
      }
      // Length Check
      if (trimmedLastName.length < 2 || trimmedLastName.length > 20) {
        throw Error(`Last name must be between 2-20 characters`);
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
      // Check if passwords match
      if (trimmedPassword !== trimmedConfirmPassword) {
        throw Error(`password and confirmPassword must match`);
      }

      //========================
      // email validation
      //========================
      // String Type Check
      if (typeof trimmedEmail !== "string") {
        throw Error(`email must be of type String`);
      }
      // Empty just spaces check
      if (trimmedEmail.length === 0) {
        throw Error(`email can't be empty or just spaces`);
      }
      // Regex Check for valid email
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)
      ) {
        throw Error(`email must be a valid email address`);
      }

      //========================
      // address validation
      //========================
      // String Type Check
      if (typeof trimmedAddress !== "string") {
        throw Error(`address must be of type String`);
      }
      // Empty just spaces check
      if (trimmedAddress.length === 0) {
        throw Error(`address can't be empty or just spaces`);
      }
      // Length Check
      if (trimmedAddress.length < 10) {
        throw Error(`address must be at least 10 characters`);
      }

      //========================
      // inHoboken validation
      //========================
      if (trimmedInHoboken !== "yes" && trimmedInHoboken !== "no") {
        return res.status(400).render("register", {
          error: `inHoboken must be either "yes" or "no"`,
        });
      }

      //========================
      // state validation (if not in Hoboken)
      //========================
      if (trimmedInHoboken === "no") {
        const validStates = [
          "AL",
          "AK",
          "AZ",
          "AR",
          "CA",
          "CO",
          "CT",
          "DE",
          "FL",
          "GA",
          "HI",
          "ID",
          "IL",
          "IN",
          "IA",
          "KS",
          "KY",
          "LA",
          "ME",
          "MD",
          "MA",
          "MI",
          "MN",
          "MS",
          "MO",
          "MT",
          "NE",
          "NV",
          "NH",
          "NJ",
          "NM",
          "NY",
          "NC",
          "ND",
          "OH",
          "OK",
          "OR",
          "PA",
          "RI",
          "SC",
          "SD",
          "TN",
          "TX",
          "UT",
          "VT",
          "VA",
          "WA",
          "WV",
          "WI",
          "WY",
        ];

        if (!trimmedState || !validStates.includes(trimmedState)) {
          return res.status(400).render("register", {
            error: "You must select a valid U.S. state if not in Hoboken.",
          });
        }
      }

      // Register the user
      const newUser = await register(
        trimmedFirstName,
        trimmedLastName,
        trimmedUserId.toLowerCase(),
        trimmedPassword,
        trimmedEmail,
        trimmedAddress,
        trimmedInHoboken,
        trimmedInHoboken === "no" ? trimmedState : null
      );

      // Check if registration was successful
      if (newUser.registrationCompleted === true) {
        const user = await login(userId, password)
        req.session.user = user
        req.session.showTerms = true;
        return res.redirect("/");
      } else {
        return res.status(400).render("register", {
          error: "Registration failed. Please try again.",
        });
      }

      //========================================
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

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
      const trimmedPassword = password; //remove the .trim() because lab10 had us not trim passwords 

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
      const tempUser = await userCollection.findOne({userId: { $regex: new RegExp(userId, 'i') }});
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
