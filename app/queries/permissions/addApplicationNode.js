// const { User } = require("../models/user");
const connectToDB = require("../../database/database");
const permissionSchema = require("../../models/permission");
const debug = require("debug")("jwtLogin:query");
require("dotenv").config();

/**
 *
 * @param {String} name
 * @param {Array} permissionNodes
 */
const addApplicationNode = async (name, permissionNodes) => {
	debug("Adding a permission...");
	// connect
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("applicationNodes");

	// declare whats going to be inserted
	debug(`Inserting new application node: ${name}`);

	// make a user object
	const applicationNode = {
		name: name,
		permissionNodes: permissionNodes,
	};

	const query = { name: name };

	try {
		// if the node exists exit early
		if (await collection.findOne(query)) {
			debug("this application node already exists");
			return undefined;
		}
		// otherwise create the application node
		debug("inserting...");
		const result = await collection.insertOne(applicationNode);
		debug(result.ops);
		return result.ops;
	} catch (err) {
		return undefined;
	} finally {
		client.close();
	}
};

module.exports = addApplicationNode;
