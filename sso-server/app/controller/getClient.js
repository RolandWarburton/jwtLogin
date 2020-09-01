const Session = require("../mongo/model/sessions");
const TokenCache = require("../mongo/model/tokenCache");
const User = require("../mongo/model/users");
const Client = require("../mongo/model/clients");
const debug = require("debug")("app:findClient");

/**
 *
 * @param {String} id - ID of the session you want to find
 */
module.exports = (secret) => {
	// debug(`looking for a session of ${id}`);
	return Client.findOne({ secret: secret }, (err, client) => {
		if (err) {
			debug(`An error occurred when looking for a session`);
			return undefined;
		}

		if (!client) {
			debug(`didnt find a session with id ${secret}`);
			return undefined;
		}

		// debug(`Found ${session.sessionID}`);
		return client;
	});
};
