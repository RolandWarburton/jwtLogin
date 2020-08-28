// const { User } = require("../models/user");
const connectToDB = require("../../database/database");
const debug = require("debug")("jwtLogin:query");
require("dotenv").config();

/**
 *
 * @param {String} name
 * @param {Array} permissionNodes
 */
const addApplicationNode = async (name, applications) => {
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("securityGroupNodes");

	// declare whats going to be inserted
	debug(`Inserting new security group node: ${name}`);

	// construct a security group from the data given
	const securityGroup = {
		name: name,
		applications: applications,
	};

	const query = { name: name };

	try {
		// if the node exists exit early
		if (await collection.findOne(query)) {
			debug("this application node already exists");
			return undefined;
		}
		// otherwise create the application node
		const result = await collection.insertOne(securityGroup);
		debug(result.ops);
		return result.ops;
	} catch (err) {
		return undefined;
	} finally {
		client.close();
	}
};

module.exports = addApplicationNode;
