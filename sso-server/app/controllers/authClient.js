const debug = require("debug")("app:authClient");

const validServiceURLs = ["devel:4000"];

const isServiceUrlProvided = (serviceURL) => {
	const wasProvided = validServiceURLs.includes(serviceURL);
	if (wasProvided) {
		debug("service url was provided");
		return true;
	} else {
		debug("service url was not provided");
	}
};

// not doing anything rn
module.exports = (req, res, next) => {
	debug(req.query);
	const { serviceURL } = req.query;
	debug(serviceURL);
	if (isServiceUrlProvided(serviceURL)) {
		res.redirect(`http://${serviceURL}`);
	}
};
