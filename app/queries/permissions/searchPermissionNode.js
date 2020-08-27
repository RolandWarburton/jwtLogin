const connectToDB = require("../../database/database");
const debug = require("debug")("v_jwtLogin:searchPerm_Q");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

/**
 *
 * @param {String} id
 */
const searchPermissionNode = async (id) => {
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("permissionNodes");

	// make a query
	debug(`Searching for an existing permission node: ${id}`);

	const query = { _id: new ObjectID(id) };

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

module.exports = searchPermissionNode;
