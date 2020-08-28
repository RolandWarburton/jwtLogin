const yup = require("yup");
const _id = require("./mongoIdString");
// const securityGroupSchema = require("./application");
// const applicationSchema = require("./application");

let schema = yup.object().shape({
	_id: _id,
	username: yup.string().required(),
	superUser: yup.bool().required(),
	applications: yup.array().required({
		permissionValue: yup.bool().required(),
		permissionNode: yup.string().required(),
	}),
	securityGroups: yup.array().of(_id),
});

module.exports = schema;

// permissionValue: yup.bool().required(),
// permissionNode: yup.string().required(),

// const user = {
// 	id: "abcd1234",
// 	name: "roland",
// 	password: "rhinos",
// 	superuser: true,
// 	// applications can overwrite security group permissions
// 	applications: [
// 		{
// 			id: "cdajf34523",
// 			name: "blogwatcher",
// 			permissions: {
// 				read: true,
// 				write: true,
// 				build: true,
// 				buildAll: true,
// 				upload: true,
// 			},
// 		},
// 	],
// 	securityGroups: ["aaaaabbbbbb"],
// };
