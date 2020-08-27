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
const findUser = require("../queries/findUser");
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
// app.get("/", a, (req, res) => {
// 	res.sendFile(path.resolve(process.env.ROOT, "public/index.html"));
// });

// starts the server when called
const server = async () => {
	// connect to mongodb database
	// const client = await connectToDB();

	// debug(findUser("username", "roland"));
	// debug(addUser("joe", "blow"));

	debug("listening...");
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
