// const { User } = require("../models/user");
const connectToDB = require("../../database/database");
const debug = require("debug")("jwtLogin:query");
require("dotenv").config();

/**
 *
 * @param {String} name
 */
const addPermissionNode = async (name) => {
	debug("Adding a permission...");
	// connect
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("permissionNodes");

	// make a query
	debug(`Inserting new permission node: ${name}`);

	// make a user object
	const permissionNode = {
		name: name,
	};

	// TODO model validation
	// validate(user);

	const query = { name: name };

	try {
		// if the node exists exit early
		if (await collection.findOne(query)) {
			debug("user node exists");
			return undefined;
		}
		// otherwise create the permission node
		const result = await collection.insertOne(permissionNode);
		debug(result.ops);
		return result.ops;
	} catch (err) {
		return undefined;
	} finally {
		client.close();
	}
};

module.exports = addPermissionNode;
