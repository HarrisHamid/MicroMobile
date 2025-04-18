import landingRoutes from "./landing.js";
import profileRoutes from "./profile.js";
import vehicleListingsRoutes from "./vehicleListings.js";

const constructorMethod = (app) => {
  app.use("/", landingRoutes);
  app.use("/profile", profileRoutes);
  app.use("/vehicleListings", vehicleListingsRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("error", { error: "Page Not Found" });
  });
};

export default constructorMethod;
