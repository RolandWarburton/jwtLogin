const { MongoMemoryServer } = require("mongodb-memory-server");
const { ObjectID } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

// May require additional time for downloading MongoDB binaries
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

const mongod = new MongoMemoryServer();
beforeAll(async () => {
	const uri = await mongod.getUri();
	const port = await mongod.getPort();
	const dbPath = await mongod.getDbPath();
	const dbName = await mongod.getDbName();

	mongod.getInstanceInfo(); // return Object with instance data
});

afterAll(async () => {
	await mongod.stop();
});

// ! SKIP
xdescribe("test validation", () => {
	it("works with async", async (done) => {
		const _id = "5f473ecb15e5c012d6f89f0e";
		done();
	});
});
