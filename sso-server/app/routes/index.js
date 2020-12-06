const express = require("express");

const router = express.Router();

// login pages
const promptLogin = require("../controllers/promptLogin");
const processLogin = require("../controllers/processLogin");
router.route("/promptLogin").get(promptLogin).post(processLogin);

// client session acquiring
const verifyToken = require("../controllers/verifyToken");
router.get("/verifyToken", verifyToken);

// router.route("/authClient").get(authClient);

module.exports = router;
