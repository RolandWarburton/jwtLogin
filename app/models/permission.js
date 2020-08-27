const yup = require("yup");

let permissionSchema = yup.object().shape({
	id: yup.string().required(),
	name: yup.string().required(),
});

module.exports = permissionSchema;

// example application
const permission = {
	id: "cdajf34523",
	name: "read",
	type: "bool",
};
