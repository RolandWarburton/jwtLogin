const addUserQuery = require("../../queries/addUser");
const debug = require("debug")("jwtLogin:createUser_C");
require("dotenv");

const createUser = async (req, res) => {
	debug("Creating a new user...");

	// get the new users details
	const username = await req.body.username;
	const password = await req.body.password;
	const applications = req.body.applications;
	const securityGroups = req.body.securityGroups;

	// ? debug bits
	// debug(JSON.stringify(req.body, null, 2));

	const result = addUserQuery(
		username,
		password,
		applications,
		securityGroups
	);
	return res.status(200).json(result || {});
};

module.exports = createUser;
