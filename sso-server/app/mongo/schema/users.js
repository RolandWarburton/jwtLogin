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
		// testApp
		"5f4e0ee4607aa5235a33154b": { role: String, shareEmail: Boolean },
		// resourceServer
		"5fce07c84fa74c1c75a75c69": { role: String, shareEmail: Boolean },
		// gateway
		"5fd4a0e2df9dda92e032cfe4": { role: String, shareEmail: Boolean },
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
