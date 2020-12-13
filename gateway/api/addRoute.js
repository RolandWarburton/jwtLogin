const fs = require("fs");
const debug = require("debug")("app:addRoute");

// return true if newRoute is contained in routes
const checkIfUnique = (routes, newRoute) => {
	for (let i = 0; i < routes.length; i++) {
		const route = routes[i];
		if (route.path === newRoute.path && route.method === newRoute.method) {
			// its not unique
			return false;
		}
	}
	return true;
};

module.exports = (filepath, newRoute) => {
	const routes = JSON.parse(fs.readFileSync(filepath));
	if (checkIfUnique(routes, newRoute)) routes.push(newRoute);

	const dataString = JSON.stringify(routes, null, 4);
	fs.writeFileSync(filepath, dataString);
	return routes;
};
