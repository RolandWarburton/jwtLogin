const app = require("./app/app");
const mongoose = require("mongoose");
const ip = require("internal-ip");
require("dotenv").config();

const url = `mongodb://admin:rhinos@10.10.10.12:27018/sso?authSource=sso`;
console.log(url);

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

app.listen(process.env.PORT, () => {
	console.info(`sso-server listening on ${ip.v4.sync()}:${process.env.PORT}`);
});
