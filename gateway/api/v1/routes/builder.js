const express = require("express");
const router = express.Router();

// ##──── controllers ───────────────────────────────────────────────────────────────────────
const routeRequest = require("../../../controllers/routeRequest");

// ##──── routes ────────────────────────────────────────────────────────────────────────────
router.get("/builder", routeRequest);

// ##──── exports ───────────────────────────────────────────────────────────────────────────
module.exports = router;
