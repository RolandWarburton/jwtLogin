const debug = require("debug")("app:helpMdlw");

const help = {
	v1: {
		"/": "hello world, this is the root route",
		"/builder": "builder base",
	},
};

const getAPIVersion = (baseUrl) => {
	return baseUrl.split("/")[2];
};

const buildHelpMiddleware = (req, res, next) => {
	// dig through the help object to get the appropriate help text
	const apiVersion = getAPIVersion(req.baseUrl);
	debug(req.route);
	const helpText = help[apiVersion][req.route.path];

	res.locals.message = helpText || "no helptext found";
	next();
};

module.exports = (req, res, next) => {
	// dig through the help object to get the appropriate help text
	const apiVersion = getAPIVersion(req.path);
	const routePath = req.originalUrl.replace(`/api/${apiVersion}`, "");
	const helpText = help[apiVersion][routePath];

	res.locals.message = helpText || "no helptext found";
	next();
};
