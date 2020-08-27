const yup = require("yup");
const permissionSchema = require("./permission");

let applicationSchema = yup.object().shape({
	id: yup.string().required(),
	permissionNodes: yup.array().of(permissionSchema),
});

module.exports = applicationSchema;

// example application
const blogwatcher = {
	id: "cdajf34523",
	permissionNodes: ["read", "write", "build", "buildAll"],
};
