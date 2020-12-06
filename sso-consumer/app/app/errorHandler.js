module.exports = (err, req, res, next) => {
	//   console.error({
	//     message: err.message,
	//     error: err,
	//   });
	const statusCode = err.status || 500;
	let message = err.message || "Internal Server Error";

	if (statusCode === 500) {
		message = "Internal Server Error";
	}
	res.status(statusCode).json({ message });
};
