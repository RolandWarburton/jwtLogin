const express = require("express");
const router = express.Router();

// ##──── middleware ────────────────────────────────────────────────────────────────────────
const buildHelpMiddleware = require("../middleware/buildHelpMiddleware");

const rootRouteHelp =
	"this is the root route help text that was generated using the build helper middleware";

// ##──── controllers ───────────────────────────────────────────────────────────────────────
const routeRequest = require("../controllers/routeRequest");

// ##──── routes ────────────────────────────────────────────────────────────────────────────
// register two test routes
router.get("/test", routeRequest);
router.get("/", routeRequest);

// ##──── exports ───────────────────────────────────────────────────────────────────────────
module.exports = router;
