/* eslint no-undef: 0 */

print("====================================================================");
print("================ RUNNING MONGO INIT-MONGO.JS SCRIPT ================");
print("====================================================================");

const databases = ["jwtLogin", "test"];

for (let i = databases.length - 1; i >= 0; i--) {
	db = db.getSiblingDB(databases[i]);

	db.createUser({
		user: "roland",
		pwd: "rhinos",
		roles: ["readWrite"],
	});
}
