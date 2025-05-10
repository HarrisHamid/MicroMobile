import express from "express";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";
import session from "express-session";
import middleware from "./middleware.js";
import authRoutes from "./routes/auth_routes.js";

import path from "path";
import { fileURLToPath } from "url";
 import { seedDatabase } from "./seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use(
  session({
    name: "AuthenticationState",
    secret: "We are the BEST transportation company",
    saveUninitialized: false,
    resave: false,
  })
);

const hbs = exphbs.create({
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
});

app.use("/", middleware.progressChecker);

app.use("/login", middleware.loginBlock);
app.use("/register", middleware.registerBlock);
app.use("/profile", middleware.unauthorizedRedirect);
app.use("/signout", middleware.signoutBlock);
app.use("/auth", authRoutes);

configRoutes(app);

 seedDatabase();

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
