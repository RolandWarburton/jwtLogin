const express = require("express");
const router = express.Router();

// ##──── controllers ───────────────────────────────────────────────────────────────────────
const routeRequest = require("../../../controllers/routeRequest");

// ##──── routes ────────────────────────────────────────────────────────────────────────────
router.get("/watcher", routeRequest);
// router.get("/pages", routeRequest);
// router.get("/page/:id", routeRequest);
router.get("/find/:a/:c", routeRequest);

// ##──── exports ───────────────────────────────────────────────────────────────────────────
module.exports = router;
