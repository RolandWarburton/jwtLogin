const addPermissionNodeQuery = require("../../queries/permissions/addPermissionNode");
// TODO redo validation in yup
// const { validateUser } = require("../../validation/validateUser");
const debug = require("debug")("jwtLogin:controllers");
require("dotenv");

const addPermissionNode = async (req, res) => {
	debug("creating a new permission node...");

	// get the new users details
	const name = req.body.name;

	// perform an insert
	const result = await addPermissionNodeQuery(name);
	return res.status(200).json(result || {});
};

module.exports = addPermissionNode;
