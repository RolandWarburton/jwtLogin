module.exports = (req, res, next) => {
	const err = new Error("Resource Not Found");
	err.status = 404;
	next(err);
};
