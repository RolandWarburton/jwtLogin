// const { User } = require("../models/user");
const connectToDB = require("../../database/database");
const ObjectID = require("mongodb").ObjectID;
const debug = require("debug")("v_jwtLogin:searchAppNode");
require("dotenv").config();

/**
 *
 * @param {String} id
 */
const searchApplicationNode = async (id) => {
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("securityGroupNodes");

	// declare whats going to be inserted
	debug(`Searching for security group node: ${id}`);

	const query = { _id: ObjectID(id) };

	try {
		// if the node exists exit early
		const permissionNode = await collection.findOne(query);
		if (permissionNode) {
			// return the found permission node
			return permissionNode;
		}
		debug("No permission node found");
		return undefined;
	} catch (err) {
		return undefined;
	} finally {
		client.close();
	}
};

module.exports = searchApplicationNode;
