const mongoose = require("mongoose");
const applicationSchema = require("./application");
const yup = require("yup");

let securityGroupSchema = yup.object().shape({
	id: yup.string().required(),
	name: yup.string().required(),
	applications: yup.array().of(applicationSchema),
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
