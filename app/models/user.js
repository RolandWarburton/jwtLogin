const securityGroupSchema = require("./application");
const securityGroup = require("./securityGroup");
const applicationSchema = require("./application");
const yup = require("yup");

let schema = yup.object().shape({
	id: yup.string().required(),
	name: yup.string().required(),
	superUser: yup.bool().required(),
	applications: yup.array().of(applicationSchema),
	securityGroups: yup.array().of(securityGroupSchema),
});

module.exports = schema;

const user = {
	id: "abcd1234",
	name: "roland",
	password: "rhinos",
	superuser: true,
	// applications can overwrite security group permissions
	applications: [
		{
			id: "cdajf34523",
			name: "blogwatcher",
			permissions: {
				read: true,
				write: true,
				build: true,
				buildAll: true,
				upload: true,
			},
		},
	],
	securityGroups: ["aaaaabbbbbb"],
};
