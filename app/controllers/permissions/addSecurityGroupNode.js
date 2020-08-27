const addSecurityGroupNodeQuery = require("../../queries/permissions/addSecurityGroupNode");
const debug = require("debug")("jwtLogin:controllers");
require("dotenv");

const addSecurityGroupNode = async (req, res) => {
	debug("creating a new security group node...");

	// get the new security groups details
	const name = req.body.name;
	const applications = req.body.applications;

	// ? for debugging
	// debug(JSON.stringify(req.body, null, 2));

	// perform an insert
	const result = await addSecurityGroupNodeQuery(name, applications);
	return res.status(200).json(result || {});
};

module.exports = addSecurityGroupNode;
