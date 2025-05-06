import express from "express";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";
import session from "express-session";
import middleware from "./middleware.js";
import authRoutes from "./routes/auth_routes.js";
import path from "path";
import { fileURLToPath } from "url";
// import { seedDatabase } from "./seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    name: "AuthenticationState",
    secret: "We are the BEST transportation company",
    saveUninitialized: false,
    resave: false,
  })
);

// Middleware
app.use("/", middleware.progressChecker);

// Auth & Route Protection
app.use("/login", middleware.loginBlock);
app.use("/register", middleware.registerBlock);
// app.use("/profile", middleware.unauthorizedRedirect);
app.use("/signout", middleware.signoutBlock);
app.use("/auth", authRoutes);

configRoutes(app);

// seedDatabase();

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
