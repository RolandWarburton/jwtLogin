const express = require("express");

const router = express.Router();
const login = require("../controllers/login");
const verifyPayload = require("../middleware/verifyPayload");
const bodyParser = require("body-parser");
// not doing anything rn
// const authClient = require("../controllers/authClient");

// login pages
const promptLogin = require("../controllers/promptLogin");
const processLogin = require("../controllers/processLogin");
router.route("/promptLogin").get(promptLogin).post(processLogin);

// client session acquiring
const verifyToken = require("../controllers/verifyToken");
router.get("/verifyToken", verifyToken);

// router.route("/authClient").get(authClient);

module.exports = router;
