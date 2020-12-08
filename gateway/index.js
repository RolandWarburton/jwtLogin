const app = require("./server/server");
const ip = require("internal-ip");
require("dotenv").config();

app.listen(process.env.PORT, () => {
	console.info(`sso-server listening on ${ip.v4.sync()}:${process.env.PORT}`);
});
