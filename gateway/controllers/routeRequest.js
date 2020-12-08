const fetch = require("node-fetch");
const debug = require("debug")("app:reqRtr");

// generic api passthrough
module.exports = (req, res) => {
	debug("================ routing a request ================");

	debug("request information:");
	debug(`params: ${JSON.stringify(req.params)}`);
	debug(`path: ${req.route.path}`);
	debug(`baseUrl: ${req.baseUrl}`);
	debug(`body: ${JSON.stringify(req.body)}`);
	debug(`tag: ${res.locals.targetService}`);

	const targetServiceUrl = res.locals.targetService;
	debug(req.params[0]);
	debug(req.params[1]);

	return res.status(200).json({
		success: true,
		message: res.locals.message || "api router",
		hostname: req.hostname,
		url: req.originalUrl,
	});
};
