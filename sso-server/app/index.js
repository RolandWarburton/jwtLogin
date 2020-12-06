const app = require("./app/app");
const mongoose = require("mongoose");
const ip = require("internal-ip");
require("dotenv").config();
// ==========
// const debug = require("debug")("app:test");
// const query = require("./queries/queryBase");
// const Client = require("./mongo/model/clients");

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

// const test = async () => {
// 	debug("querying");
// 	const res = await query(Client, { _id: "5f4e0ee4607aa5235a33154b" });
// 	debug(`result: ${res}`);
// };
// test();

app.listen(process.env.PORT, () => {
	console.info(`sso-server listening on ${ip.v4.sync()}:${process.env.PORT}`);
});
