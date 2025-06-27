const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const eventRoute = require("./event.route");
const categoryRoute = require("./category.route");
const venueRoute = require("./venue.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/events",
    route: eventRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/venues",
    route: venueRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router; 