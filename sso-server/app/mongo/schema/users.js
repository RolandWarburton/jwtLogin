// username		roland
// password		supersecret
// uid			a random user id
// email		warburtonroland@gmail.com
// appPolicy	role (admin/user, etc. whatever you want), shareEmail (rename this to any permissions you might want to use)

module.exports = {
	username: String,
	password: String,
	uid: String,
	email: String,
	appPolicy: {
		testApp: { role: String, shareEmail: Boolean },
	},
};

// const userDB = {
// 	"warburtonroland@gmail.com": {
// 		password: "password",
// 		userId: "warburtonroland@gmail.com",
// 		appPolicy: {
// 			testApp: { role: "admin", shareEmail: true },
// 			simple_sso_consumer: { role: "user", shareEmail: false },
// 		},
// 	},
// };

// ! Example data for the mongo table
// {
// 	"username": "roland",
// 	"password": "password",
// 	"uid": "abc123",
// 	"email": "warburtonroland@gmail.com",
// 	"appPolicy": {
// 		"testApp": {"role": "admin", "shareEmail": true}
// 	}
// }
