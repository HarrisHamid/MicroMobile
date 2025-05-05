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

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
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
//app.use('/vehicleListings', middleware.vehicleListingsAuth); //want all users to be able to view this page

// temporary for testing vehicle listings page
app.get('/testListings', (req, res) => {
  const testPosts = [
    {
      _id: "1",
      postTitle: "Test Scooter",
      vehicleType: "Scooter",
      vehicleTags: ["Electric", "Portable"],
      vehicleCondition: 4.5,
      hourlyCost: 5,
      dailyCost: 25,
      image: "/public/uploads/seed1.png" // Make sure this image exists
    },
    {
      _id: "2",
      postTitle: "Test Bike",
      vehicleType: "Bicycle",
      vehicleTags: ["Mountain", "Durable"],
      vehicleCondition: 4.2,
      hourlyCost: 3,
      dailyCost: 15,
      image: "/public/uploads/seed2.jpg" // Make sure this image exists
    }
  ];
  
  res.render('vehicleListings', {
    title: 'Test Listings',
    posts: testPosts
  });
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
