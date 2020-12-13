const fs = require("fs");
const express = require("express");
const routeRequest = require("../controllers/routeRequest");
const isAuthenticated = require("../middleware/isAuthenticated");

module.exports = (routesPath) => {
	const routes = JSON.parse(fs.readFileSync(routesPath, "utf-8"));
	const router = express.Router();

	for (let i = 0; i < routes.length; i++) {
		const route = routes[i];
		router[route.method.toLowerCase()](route.path, routeRequest);
	}

	return router;
};
