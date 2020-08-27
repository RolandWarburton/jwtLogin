const express = require("express");
const bodyParser = require("body-parser");
const buildRouter = require("./buildeRouter");
const debug = require("debug")("jwtLogin:routers");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const addPermissionNode = require("../controllers/permissions/addPermissionNode");
const addApplicationNode = require("../controllers/permissions/addApplicationNode");
const addSecurityGroupNode = require("../controllers/permissions/addSecurityGroupNode");

const routes = [
	{
		path: "/addPermissionNode",
		method: "post",
		middleware: [authenticate],
		handler: addPermissionNode,
		help: {
			description: "Add a new permission node",
			method: this.method,
		},
	},
	{
		path: "/addApplicationNode",
		method: "post",
		middleware: [authenticate],
		handler: addApplicationNode,
		help: {
			description: "Add a new permission node",
			method: this.method,
		},
	},
	{
		path: "/addSecurityGroupNode",
		method: "post",
		middleware: [authenticate],
		handler: addSecurityGroupNode,
		help: {
			description: "Add a new permission node",
			method: this.method,
		},
	},
];

// build the router!
debug("building the permission node routes");
buildRouter(router, routes);

module.exports = router;
