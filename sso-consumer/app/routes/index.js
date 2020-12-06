const express = require("express");

const router = express.Router();
const login = require("../controllers/login");
const authClient = require("../controllers/authClient");
const promptLogin = require("../controllers/promptLogin");
const processLogin = require("../controllers/processLogin");

router.route("/promptLogin").get(promptLogin).post(processLogin);
router.route("/authClient").get(authClient);

module.exports = router;
