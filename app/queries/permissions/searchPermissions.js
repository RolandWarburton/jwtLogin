// const { User } = require("../models/user");
const connectToDB = require("../../database/database");
const ObjectID = require("mongodb").ObjectID;
const permissionSchema = require("../../models/permission");
const debug = require("debug")("v_jwtLogin:searchAppNode");
require("dotenv").config();

/**
 *
 * @param {String} id
 * @param {String} collection
 */
const searchApplicationNode = async (collectionName, query) => {
	// debug("conencting");
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection(collectionName);

	// declare whats going to be inserted
	debug(`Searching for ${collection} node: ${query}`);

	try {
		// if the node exists exit early
		const node = await collection.findOne(query);
		if (node) {
			// return the found node
			return node;
		}
		debug(`No ${collection} node found`);
		return undefined;
	} catch (err) {
		return undefined;
	} finally {
		client.close();
	}
};

module.exports = searchApplicationNode;
