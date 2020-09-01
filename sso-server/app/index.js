const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = 3010;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;
const auth = process.env.DB_AUTHENTICATION_DATABASE;
const userAuth = `${username}:${password}`;
const url = `mongodb://${userAuth}@10.10.10.12:${port}/${database}?authsource=${auth}`;
console.log(url);
// mongodb://admin:rhinos@devel:27018/sso?authSource=sso

mongoose.connect(
	url,
	{
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	function (err, res) {
		if (err) {
			return console.error('Error connecting to "%s":', url, err);
		}
		console.log('Connected successfully to "%s"', url);
	}
);

app.listen(PORT, () => {
	console.info(`sso-server listening on port ${PORT}`);
});
