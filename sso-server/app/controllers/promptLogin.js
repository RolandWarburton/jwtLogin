const debug = require("debug")("app:promptLogin");

module.exports = (req, res, next) => {
	debug("prompting login");
	return res.status(200).render("login", {
		title: "login",
		success: true,
	});
};
