const tagWatcherClient = (req, res, next) => {
	res.locals.targetService = "https://watch.rolandw.dev/";
	next();
};

module.exports = tagWatcherClient;
