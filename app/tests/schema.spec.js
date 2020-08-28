const userSchema = require("../models/user");
const applicationSchema = require("../models/application");
const permissionSchema = require("../models/permission");
const securityGroupSchema = require("../models/securityGroup");

describe("test validation", () => {
	it("works with async", async (done) => {
		const _id = "5f473ecb15e5c012d6f89f0e";
		done();
	});
});

// 	return new Promise(resolve => {
// 		// This is an example of an http request, for example to fetch
// 		// user data from an API.
// 		// This module is being mocked in __mocks__/request.js
// 		http.get({path: url}, response => {
// 		  let data = '';
// 		  response.on('data', _data => (data += _data));
// 		  response.on('end', () => resolve(data));
// 		});
// 	  });

// 	const _id = "5f473ecb15e5c012d6f89f0e";
// 	const query = { _id: new ObjectID(_id) };
// 	const permission = await searchPermissions("permissionNodes", query);
// 	const val = await permissionSchema.validate(permission);
// 	// debug("validated permission successfully! ✅");
// 	expect(val).toEqual(expected);
// 	// try {
// 	// } catch (err) {
// 	// 	// debug(err);
// 	// }
// });

// // ! tests for validating a user
// try {
// 	const _id = "5f489e6d01eeff2542c7025a";
// 	const query = { _id: new ObjectID(_id) };
// 	const user = await searchPermissions("users", query);
// 	const val = await userSchema.validate(user);
// 	debug("validated user successfully! ✅");
// } catch (err) {
// 	debug(err);
// }

// // ! tests for validating a sec group
// try {
// 	const _id = "5f47b2191688c919d29f0bbd";
// 	const query = { _id: new ObjectID(_id) };
// 	const secGroup = await searchPermissions("securityGroupNodes", query);
// 	const val = await securityGroupSchema.validate(secGroup);
// 	debug("validated sec group successfully! ✅");
// } catch (err) {
// 	debug(err);
// }

// // ! tests for validating an application
// try {
// 	const _id = "5f4780be9ceea40d7194473b";
// 	const query = { _id: new ObjectID(_id) };
// 	const application = await searchPermissions("applicationNodes", query);
// 	const val = await applicationSchema.validate(application);
// 	debug("validated application successfully! ✅");
// } catch (err) {
// 	debug(err);
// }

// // ! tests for validating a permission
// try {
// 	const _id = "5f473ecb15e5c012d6f89f0e";
// 	const query = { _id: new ObjectID(_id) };
// 	const permission = await searchPermissions("permissionNodes", query);
// 	const val = await permissionSchema.validate(permission);
// 	debug("validated permission successfully! ✅");
// } catch (err) {
// 	debug(err);
// }
