// const { User } = require("../models/user");
const connectToDB = require("../../database/database");
const permissionSchema = require("../../models/permission");
const searchApplicationNode = require("./searchApplicationNode");
const searchPermissionNode = require("./searchPermissionNode");
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

	// const tempNodeID = "5f4780be9ceea40d7194473b";
	// // for (applicationID of applications) {
	// 	for (let i = 0; i < applications.length; i++) {
	// 		const application = applications[i];

	// 		const permissionNodes = [];

	// 		// then loop through every permission node and fetch it
	// 		const application = await searchApplicationNode(tempNodeID);
	// 		for (let j = 0; j < application.permissionNodes.length; j++) {
	// 			const permissionNodeID = application.permissionNodes[j];
	// 			const permissionNode = await searchPermissionNode(permissionNodeID);
	// 			applications[i].permissionNodes[j] = {id: permissionNodeID, value: }
	// 		}
	// 	}
	// these are all the permission nodes grouped my application
	// for (permissionNodeID of application.permissionNodes) {
	// 	const permissionNode = await searchPermissionNode(permissionNodeID);
	// 	debug(application);
	// 	// applications;
	// 	// permissionNodes.push();
	// }
	// policy.push({ applicationID, permissions: permissionNodes });
	// }

	// debug(JSON.stringify(policy, null, 2));
	// // make a user object
	// const applicationNode = {
	// 	name: name,
	// 	permissionNodes: permissionNodes,
	// };

	// const query = { name: name };

	// try {
	// 	// if the node exists exit early
	// 	if (await collection.findOne(query)) {
	// 		debug("this application node already exists");
	// 		return undefined;
	// 	}
	// 	// otherwise create the application node
	// 	const result = await collection.insertOne(applicationNode);
	// 	debug(result.ops);
	// 	return result.ops;
	// } catch (err) {
	// 	return undefined;
	// } finally {
	// 	client.close();
	// }
};

module.exports = addApplicationNode;
