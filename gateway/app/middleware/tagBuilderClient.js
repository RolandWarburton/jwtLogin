const tagBuilderClient = (req, res, next) => {
	// res.locals.targetService = "https://build.rolandw.dev";
	res.locals.targetService = "http://blogbuilder:3000";
	next();
};

module.exports = tagBuilderClient;
