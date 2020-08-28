const findUser = require("../../queries/searchUser");
const jwt = require("jsonwebtoken");
// TODO redo validation in yup
// const { validateUser } = require("../../validation/validateUser");
const debug = require("debug")("jwtLogin:controllers");

const login = async (req, res) => {
	debug("logging in...");
	// get the username and password from the body (x-www-form-urlencoded)
	const username = req.body.username;
	const password = req.body.password;

	// TODO validation
	// Check if the new users details are correct
	// const { isVaidUser, error } = validateUser(username, password);
	// if (!isVaidUser) {
	// 	return res.status(401).json({ success: false, error: error });
	// }

	const user = await findUser("username", username);

	// check if the user was retrieved from the database
	if (!user) {
		return res.status(401).json({
			success: false,
			error: `Could not find user ${username}`,
		});
	}

	// Check the password is correct
	if (user.password != password) {
		return res.status(401).json({
			success: false,
			error: `Wrong password for ${username}`,
		});
	}

	// sign a token for the user
	debug("Signing a new token for the user");
	const token = jwt.sign({ _id: user._id }, process.env.USER_KEY);

	// put the token in a http cookie 🍪
	debug("put auth-token in a res cookie");
	res.cookie("auth-token", token, { sameSite: true });

	// log the login event
	// logger.log("info", `Login from ${user._id}`);

	// return 200 all good and attach the user and token
	debug("returning the cookie");
	return res
		.status(200)
		.json({ success: true, user: user, "auth-token": token });
};

module.exports = login;
