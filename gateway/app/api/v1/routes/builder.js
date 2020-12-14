const loadRoutes = require("../../loadRoutes");
const routes = loadRoutes("./api/v1/routes/build.rolandw.dev.json");

// ##──── controllers ───────────────────────────────────────────────────────────────────────
const routeRequest = require("../../../controllers/routeRequest");

// ##──── routes ────────────────────────────────────────────────────────────────────────────
routes.get("*", routeRequest).post("*", routeRequest);

// ##──── exports ───────────────────────────────────────────────────────────────────────────
module.exports = routes;
