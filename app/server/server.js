const connectToDB = require("../database/database");
const debug = require("debug")("jwtLogin:server");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// routes
const userRoutes = require("../routes/userRoutes");
const permissionNodeRoutes = require("../routes/permissionNodeRoutes");

// testing stuff
const searchUser = require("../queries/searchUser");
const searchPermissions = require("../queries/permissions/searchPermissions");
const ObjectID = require("mongodb").ObjectID;
const userSchema = require("../models/user");
const securityGroupSchema = require("../models/securityGroup");
const applicationSchema = require("../models/application");
const permissionSchema = require("../models/permission");
// const permissionSchema = require("../models/permission");
const addUser = require("../queries/addUser");

debug("============================================");
debug("JWT Login server is starting...");
debug(`WORKING IN:\t${process.env.ROOT}`);
debug(`RUNNING ON PORT:\t${process.env.PROTOCOL}`);
debug("============================================");

const app = express();

// cors shit
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// cookies
app.use(cookieParser());

// Support x-www-urlencoded on all routes
const urlencodedParser = bodyParser.urlencoded({
	limit: "5mb",
	extended: true,
});
app.use(urlencodedParser);

// support application/json on all routes
const jsonParser = bodyParser.json({
	limit: "5mb",
});
app.use(jsonParser);

// ? optional use express x-www-urlencoded parser
// ? right now im using body-parser instead
// app.use(express.urlencoded({ extended: true }));

// user routes live here
app.use("/", userRoutes);

// permission routes live here
app.use("/permission", permissionNodeRoutes);

// quick and dirty upload form
app.use("/", express.static(path.resolve(process.env.ROOT, "public")));

// starts the server when called
const server = async () => {
	// start the server
	app.listen(process.env.PORT, () =>
		debug(
			`app listening at ${process.env.PROTOCOL}://localhost:${process.env.PORT}`
		)
	);

	// fallback for root path
	app.get("/", (req, res) => {
		res.status(200).json({
			success: true,
			help: "post to /page to upload a new page",
		});
	});
};

module.exports = server();

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
