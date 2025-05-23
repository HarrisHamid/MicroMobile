import landingRoutes from "./landing.js";
import profileRoutes from "./profile.js";
import authRoutes from "./auth_routes.js";
import vehicleListingsRoutes from "./vehicleListings.js";

const constructorMethod = (app) => {
  app.use("/", landingRoutes);
  app.use("/profile", profileRoutes);
  app.use("/vehicleListings", vehicleListingsRoutes);
  app.use("/auth", authRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("error", {
      title: "Something Went Wrong",
      error: "Page Not Found",
    });
  });
};

export default constructorMethod;
