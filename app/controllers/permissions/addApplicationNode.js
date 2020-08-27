const addApplicationNodeQuery = require("../../queries/permissions/addApplicationNode");
const debug = require("debug")("jwtLogin:controllers");
require("dotenv");

const addApplicationNode = async (req, res) => {
	debug("creating a new application node...");

	// get the new applications name and permission nodes
	const name = req.body.name;
	const permissionNodes = req.body.permissionNodes;

	// perform an insert
	const result = await addApplicationNodeQuery(name, permissionNodes);
	return res.status(200).json(result || {});
};

module.exports = addApplicationNode;
