import express from "express";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";
import session from "express-session";
import middleware from "./middleware.js";
import authRoutes from "./routes/auth_routes.js";

const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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

app.use("/", middleware.progressChecker);

app.use("/login", middleware.loginBlock);
app.use("/register", middleware.registerBlock);
// app.use('/profile', middleware.unauthorizedRedirect);
app.use("/signout", middleware.signoutBlock);
app.use("/auth", authRoutes);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
