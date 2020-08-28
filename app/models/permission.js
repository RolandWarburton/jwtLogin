const yup = require("yup");
const _id = require("./mongoIdString");

let permissionSchema = yup.object().shape({
	_id: _id,
	name: yup.string().required(),
});

module.exports = permissionSchema;

// example application
const permission = {
	id: "cdajf34523",
	name: "read",
	type: "bool",
};
