import express from "express";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";
import session from 'express-session';
import middleware from "./middleware.js"
import path from 'path';
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdir(uploadDir, { recursive: true });
}

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    name: 'AuthenticationState',
    secret: 'We are the BEST transportation company',
    saveUninitialized: false,
    resave: false
  })
);

app.use('/', middleware.progressChecker);

app.use('/login', middleware.loginBlock);
app.use('/register', middleware.registerBlock);
app.use('/profile', middleware.unauthorizedRedirect);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
