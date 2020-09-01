const Session = require("../mongo/model/sessions");
const TokenCache = require("../mongo/model/tokenCache");
const User = require("../mongo/model/users");
const debug = require("debug")("app:findCachedToken");

/**
 *
 * @param {String} tokenID - ID of the session you want to find
 */
module.exports = (tokenID) => {
	debug(`looking for ${tokenID}`);
	return TokenCache.findOne({ tokenID: tokenID }, (err, token) => {
		if (err) {
			debug(`An error occurred when looking for a token`);
			return undefined;
		}

		if (!token) {
			debug(`didnt find a token with tokenID ${tokenID}`);
			return undefined;
		}

		// debug(`Found ${token.tokenID}`);
		return token;
	});
};
