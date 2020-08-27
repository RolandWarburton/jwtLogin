const { User } = require("./models/user");
const debug = require("debug")("jwtLogin:setup");
const chalk = require("chalk");
const findUser = require("./queries/findUser");
const connectToDB = require("./database/database");
require("dotenv").config();
// get the db
// const { connectToDB, disconnectFromDB } = require("./database/database");
const addUser = require("./queries/addUser");

const setup = async () => {
	// connect to database 🗃
	debug("connecting");
	// connect
	const client = await connectToDB();
	const database = client.db("jwtLogin");
	const collection = database.collection("users");

	const username = process.env.ACCOUNT_MASTER_USERNAME;
	const password = process.env.ACCOUNT_MASTER_PASSWORD;

	// if (!queriedUser) {
	// 	debug(`Creating AccountMaster account (${username})`);

	const newUser = {
		username: username,
		password: password,
		superUser: true,
	};

	const query = { username: username };

	try {
		const user = await collection.findOne(query);
		if (!user) {
			debug("Didnt find a user. Adding one");
			const result = await collection.insertOne(newUser);
			debug(result.opts);
			return undefined;
		} else {
			debug(`user ${username} already exists`);
		}
		return user;
	} catch (err) {
		return undefined;
	} finally {
		debug("closing connection");
		client.close();
	}

	// 	await newUser
	// 		.save()
	// 		.then((user) => {
	// 			debug(`Successfully created new master user: ${user.username}`);
	// 		})
	// 		.catch((err) => {
	// 			console.log(chalk.red(err));
	// 		});
	// } else {
	// 	debug(`Account already exists (${queriedUser.username})`);
	// }

	// nothing more to do
	// disconnectFromDB().then(() => {
	// 	debug("Successfully closed the database connection.");
	// });
};

module.exports = setup();
