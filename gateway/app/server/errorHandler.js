module.exports = (err, req, res, next) => {
	const statusCodeFailMsg = "failed before status code was determined";
	const statusCode = err.status || statusCodeFailMsg;
	let message = err.message || "Internal Server Error";

	if (statusCode === 500) {
		message = "Internal Server Error";
	}
	res.status(statusCode == statusCodeFailMsg ? 500 : err.status).json({
		message: "something went wrong!",
		status: statusCode,
		stack: err.message,
	});
};
