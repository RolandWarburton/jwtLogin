const Session = require("../mongo/model/sessions");
const TokenCache = require("../mongo/model/tokenCache");
const User = require("../mongo/model/users");
const debug = require("debug")("app:findUser");
const supportsColor = require("supports-color");

/**
 *
 * @param {JSON} query
 */
module.exports = (query) => {
	// debug(query);
	return User.findOne(query, (err, user) => {
		if (err) {
			debug(`An error occurred when looking for a user`);
			return undefined;
		}

		if (!user) {
			debug(`didnt find a user ${JSON.stringify(query)}`);
			return undefined;
		}

		debug(`Found user ${user.username}`);
		return user;
	});
};
