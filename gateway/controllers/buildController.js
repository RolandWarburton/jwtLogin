// "factory" that builds controllers for requests that need special attention
// for example multiple parameters that need to be parsed in order justify a custom controller

const fetch = require("node-fetch");
const debug = require("debug")("app:buildCtrl");

const doFetch = async (url) => {
	const response = await fetch(url);
	if (response.status != 200) {
		debug(response);
		throw new Error("didnt get 200 back from service");
	}
	const json = await response.json();
	return json;
};

/**
 *
 * @param {Array} params
 */
const buildController = (path, urlAppender) => {
	// create a controller
	const controller = async (req, res, next) => {
		// grab the path that
		const sanitizedPath = path.replace(/^\//g, "");
		let targetUrl = new URL(res.locals.targetService + sanitizedPath);
		targetUrl.href += urlAppender(req, res, next);

		// debug(targetUrl);
		const result = await doFetch(targetUrl.href).catch((err) => debug(err));
		debug(result);

		return res.status(200).json({
			success: true,
			path: path,
			clientTag: res.locals.targetService,
		});
	};

	// return the controller, and the stuff used to create it so we can access it later
	return { controller, path };
};

module.exports = buildController;

// handle params
// if (params.length > 0) {
// 	for (let i = 0; i < params.length; i++) {
// 		const param = params[i];
// 		const key = Object.keys(param)[0];
// 		if (i != 0) targetUrl += `&${key}=${param[key]}`;
// 		else targetUrl += `?${key}=${param[key]}`;
// 	}
// }
