import landingRoutes from "./landing.js";
import profileRoutes from "./profile.js";
import authRoutes from "./auth_routes.js";
import vehicleListingsRoutes from "./vehicleListings.js";
import createListingRoutes from "./createListing.js";

const constructorMethod = (app) => {
  app.use("/", landingRoutes);
  app.use("/profile", profileRoutes);
  app.use("/vehicleListings", vehicleListingsRoutes);
  app.use("/auth", authRoutes);
  app.use("/createListing", createListingRoutes); //I don't think. We already have /vehicleListings/createListing. -Jack
  
  app.use("*", (req, res) => {
    res.status(404).render("error", { error: "Page Not Found" });
  });
};

export default constructorMethod;
