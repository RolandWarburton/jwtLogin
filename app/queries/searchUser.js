// const { User } = require("../models/user");
const connectToDB = require("../database/database");
const debug = require("debug")("jwtLogin:query");
require("dotenv").config();

// * get a users info from the users table
/** Returns a promise that resolves to an object from the imageHost.users database
 * or null if not found
 * @example
 * queryUser("username", "roland");
 * @param {string} queryField - The key to lookup. Eg. "username"
 * @param {string} queryValue - The value to loopup. Eg. "roland"
 */
const findUser = async (queryField, queryValue) => {
	debug("Running queryUser from db queries...");
	// connect
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("users");

	// make a query
	debug(`Looking for user where ${queryField} = ${queryValue}`);
	const query = { [queryField]: queryValue };

	// try and find a user
	try {
		const user = await collection.findOne(query);
		if (!user) {
			debug("Didnt find a user");
			return undefined;
		}
		debug(`found user ${user.username}`);
		return user;
	} catch (err) {
		return undefined;
	}
};

module.exports = findUser;
