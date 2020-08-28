const yup = require("yup");
const _id = require("./mongoIdString");
// const permissionSchema = require("./permission");

let applicationSchema = yup.object().shape({
	_id: _id,
	name: yup.string().required(),
	permissionNodes: yup.array().of(_id),
});

module.exports = applicationSchema;

// example application
// const blogwatcher = {
// 	id: "cdajf34523",
// 	permissionNodes: ["read", "write", "build", "buildAll"],
// };
