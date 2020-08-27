const mongoose = require("mongoose");
const util = require("util");
const debug = require("debug")("jwtLogin:database");
const isDocker = require("is-docker");
// const { catch } = require("../server/server");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

// allow update commands
// mongoose.set("useFindAndModify", false);

/**
 * @example connect("mongodb://user:pass(at)ip:27017/db?authSource=auth")
 * @param {string} url - url to connect to
 */
const connectToDB = async () => {
	const username = process.env.DB_USERNAME;
	const password = process.env.DB_PASSWORD;
	const port = process.env.DB_PORT;
	const database = process.env.DB_DATABASE;
	const auth = process.env.DB_AUTHENTICATION_DATABASE;

	const addr = isDocker() ? "mongo" : "localhost";
	const userAuth = username ? `${username}:${password}@` : "";
	const url = `mongodb://${userAuth}${addr}:${port}/${database}?authsource=${auth}`;
	// const uri = `mongodb+srv://10.10.10.12:27018/?poolSize=20&w=majority`;

	const connectionSchema = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	const client = new MongoClient(url, connectionSchema);

	try {
		await client.connect();
		await client.db("admin").command({ ping: 1 });
		// debug("MongoDB database connection established successfully 🗄");
		return client;
	} finally {
		// debug("and away we go!")
	}
};

module.exports = connectToDB;
