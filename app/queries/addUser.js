// const { User } = require("../models/user");
const connectToDB = require("../database/database");
const searchUser = require("./searchUser");
const debug = require("debug")("jwtLogin:query");
require("dotenv").config();

const addUser = async (
	username,
	password,
	superUser,
	applications,
	securityGroups
) => {
	debug("Running queryUser from db queries...");
	// connect
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("users");

	// make a query
	debug(`Inserting new user: ${username}`);

	// make a user object
	const user = {
		username: username,
		password: password,
		superUser: superUser,
		applications: applications,
		securityGroups: securityGroups,
	};

	// TODO model validation
	// validate(user);

	// try and find a user
	try {
		if (await searchUser("username", username)) {
			debug("user already exists");
			return undefined;
		}
		const result = await collection.insertOne(user);
		debug(result.ops);
		return result.ops;
	} catch (err) {
		return undefined;
	}
};

module.exports = addUser;
