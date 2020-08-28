const yup = require("yup");
const _id = require("./mongoIdString");
// const applicationSchema = require("./application");

let securityGroupSchema = yup.object().shape({
	_id: _id,
	name: yup.string().required(),
	applications: yup.array().required({
		permissionValue: yup.bool().required(),
		permissionNode: yup.string().required(),
	}),
});

module.exports = securityGroupSchema;

// exampleSecurityGroup
// when a new admin group is created its applications permissions are validated against its validPermNodes, if not specified they are auto created as true
const administratorGroup = {
	id: "aaaaabbbbbb",
	name: "administrators",
	applications: [
		{
			id: "cdajf34523",
			read: true,
			write: false,
			build: true,
			buildAll: true,
		},
	],
};
