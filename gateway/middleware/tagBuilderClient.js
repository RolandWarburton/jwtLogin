const tagBuilderClient = (req, res, next) => {
	res.locals.targetService = "https://build.rolandw.dev";
	next();
};

module.exports = tagBuilderClient;
