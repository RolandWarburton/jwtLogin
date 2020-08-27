// const { User } = require("../models/user");
const connectToDB = require("../../database/database");
const ObjectID = require("mongodb").ObjectID;
const permissionSchema = require("../../models/permission");
const debug = require("debug")("v_jwtLogin:searchAppNode");
require("dotenv").config();

/**
 *
 * @param {String} id
 */
const searchApplicationNode = async (id) => {
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("applicationNodes");

	// declare whats going to be inserted
	debug(`Searching for application node: ${id}`);

	const query = { _id: ObjectID(id) };

	try {
		// if the node exists exit early
		const result = await collection.findOne(query);
		if (result) {
			debug("this application node already exists");
			return result;
		}
		// otherwise create the application node
		debug("not found...");
		return undefined;
	} catch (err) {
		return undefined;
	} finally {
		client.close();
	}
};

module.exports = searchApplicationNode;
