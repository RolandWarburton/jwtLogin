const tagWatcherClient = (req, res, next) => {
	// res.locals.targetService = "https://watch.rolandw.dev";
	res.locals.targetService = "http://blogwatcher:3000";
	next();
};

module.exports = tagWatcherClient;
