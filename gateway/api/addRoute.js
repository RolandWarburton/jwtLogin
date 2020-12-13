const fs = require("fs");
const debug = require("debug")("app:addRoute");
const { uniq } = require("underscore");

// return true if newRoute is contained in routes
const checkIfUnique = (routes, newRoute) => {
	let isUnique = true;
	routes.forEach((route) => {
		if (route.path === newRoute.path && route.method === newRoute.method)
			isUnique = false;
	});

	return isUnique;
};

module.exports = (filepath, newRoute) => {
	const routes = JSON.parse(fs.readFileSync(filepath));
	if (checkIfUnique(routes, newRoute)) routes.push(newRoute);

	const dataString = JSON.stringify(routes, null, 4);
	debug(routes);
	fs.writeFileSync(filepath, dataString);
	return routes;
};
