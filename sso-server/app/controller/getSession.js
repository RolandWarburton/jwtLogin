const Session = require("../mongo/model/sessions");
const TokenCache = require("../mongo/model/tokenCache");
const User = require("../mongo/model/users");
const debug = require("debug")("app:findSession");

/**
 *
 * @param {String} id - ID of the session you want to find
 */
module.exports = (id) => {
	// debug(`looking for a session of ${id}`);
	return Session.findOne({ sessionID: id }, (err, session) => {
		if (err) {
			debug(`An error occurred when looking for a session`);
			return undefined;
		}

		if (!session) {
			debug(`didnt find a session with id ${id}`);
			return undefined;
		}

		// debug(`Found ${session.sessionID}`);
		return session;
	});
};
