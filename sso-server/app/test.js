const debug = require("debug")("app:test");
const query = require("./queries/queryBase");
const Client = require("./mongo/model/clients");

const test = async () => {
	debug("querying");
	const res = await query(Client, { name: "testApp" });
	debug(`result: ${res}`);
};
test();
