const express = require("express");
const bodyParser = require("body-parser");
const buildRouter = require("./buildeRouter");
const debug = require("debug")("jwtLogin:routers");
var cookieParser = require("cookie-parser");
const router = express.Router();

const createUser = require("../controllers/users/createUser");
const login = require("../controllers/users/login");
const authenticate = require("../middleware/authenticate");

const routes = [
	{
		path: "/createUser",
		method: "post",
		// pass the body-parser middleware to this route to give it access to req.body.username/password
		middleware: [authenticate],
		handler: createUser,
		help: {
			description: "Create a user",
			method: this.method,
			formOptions: {
				username: "String",
				password: "String",
				superUser: "Boolean",
			},
			example: "/createUser",
		},
	},
	{
		path: "/login",
		method: "post",
		middleware: [],
		handler: login,
		help: {
			description: "Log a user in",
			method: this.method,
			formOptions: {
				username: "String",
				password: "String",
			},
			example: "/login",
		},
	},
	{
		path: "/logout",
		method: "post",
		middleware: [],
		handler: createUser,
		help: {
			description:
				"Log a user out. Clears their token from the session cookies",
			method: this.method,
			example: "/logout",
		},
	},
];

router.get("/cookies", [cookieParser()], (req, res) => {
	debug("sending cookies 🍪");
	res.status(200).json({
		hello: "check your cookies",
		cookie: req.cookies["auth-token"],
	});
});

router.get("/logout", (req, res) => {
	res.clearCookie("auth-token");
	res.clearCookie("user");
	res.send("user logout successfully");
});

// build the router!
debug("building the page routes");
buildRouter(router, routes);

module.exports = router;
