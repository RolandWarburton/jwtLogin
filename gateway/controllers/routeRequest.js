const fetch = require("node-fetch");
const path = require("path");
const debug = require("debug")("app:reqRtr");
const addRoute = require("../api/addRoute");

const extractParamOrder = (routePath) => {
	const routePathArray = routePath
		.split("/")
		.filter(String)
		.filter((val) => val[0] == ":");
	return routePathArray.map((val) => val.substring(1));
};

const constructParamUrlString = (paramArray, params) => {
	let paramString = "";
	for (let i = 0; i < paramArray.length; i++) {
		const p = paramArray[i];
		paramString += `${params[paramArray[i]]}/`;
	}
	return paramString;
};

const doFetch = async (url, method, body) => {
	const options = {
		method: method,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (method == "POST") options.body = JSON.stringify(body);

	const response = await fetch(url, options);
	const json = await response.json();
	if (response.status != 200) {
		debug(response);
		throw new Error(
			`didnt get 200 back from service that the gateway requested. ${JSON.stringify(
				json
			)}`
		);
	}
	return json;
};

// generic api passthrough
module.exports = async (req, res) => {
	debug("================ routing a request ================");

	debug("request information:");
	debug(`params: ${JSON.stringify(req.params)}`);
	debug(`path: ${req.route.path}`);
	debug(`baseUrl: ${req.baseUrl}`);
	debug(`body: ${JSON.stringify(req.body)}`);
	debug(`tag: ${res.locals.targetService}`);

	// get the params as an array in order that they appear
	const params = extractParamOrder(req.route.path);

	// construct the in-order params array into a URL friendly string
	const paramString = constructParamUrlString(params, req.params);

	// extract there this request is going
	const targetServiceUrl = res.locals.targetService;

	const reqUrl = targetServiceUrl + req.path;

	const result = await doFetch(reqUrl, req.method, req.body)
		.then((result) => {
			debug("returning results to user");
			res.status(200).json({
				...result,
			});
		})
		.catch((err) => {
			debug("throwing error");
			return res.status(400).send(err.message);
		});

	// add the route to the routes json collection under the hostname. eg. subdomain.example.com.json
	addRoute(`./api/v1/routes/${new URL(targetServiceUrl).hostname}.json`, {
		path: req.path,
		method: req.method,
	});

	// return res.status(200).json({
	// 	success: true,
	// 	message: res.locals.message || "api router",
	// 	hostname: req.hostname,
	// 	url: req.originalUrl,
	// });
};
