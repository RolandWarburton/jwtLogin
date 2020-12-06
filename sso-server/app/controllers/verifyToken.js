const { genJwtToken } = require("../helpers/jwt_helper");
const signPyaload = require("../helpers/signPyaload");
const debug = require("debug")("app:verifToken");

const query = require("../queries/queryBase");
const User = require("../mongo/model/users");
const TokenCache = require("../mongo/model/tokenCache");

const validateBearerToken = (token) => {
	if (token.startsWith("Bearer") && token.split(" ").length == 2) {
		return true;
	}
	return false;
};

const parseBearerToken = (token) => {
	if (!validateBearerToken(token)) {
		throw { name: "sso_server", message: "Bearer was incorrect" };
	}

	// split the string and reverse it to get the token part
	return token.split(" ").reverse();
};

const mockFindUser = async (_id) => {
	const filter = { _id: _id };
	const user = await query(User, filter);
	return user;
};

// return the token from the auth token cache
const getClientAuthToken = async (_id) => {
	const filter = {
		_id: _id,
	};
	debug(filter);
	const token = await query(TokenCache, filter, { castID: false });
	return token;
};

const getClient = (_id) => {
	return {
		_id: "5f4e0ee4607aa5235a33154b",
		name: "testApp",
		secret: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
	};
};

module.exports = async (req, res) => {
	debug("verifying token");

	// grab the bearer token from the header that identifies this client
	const [bearer] = parseBearerToken(req.get("Authorization"));
	debug(`received the bearer: "${bearer}"`);

	const authToken = await getClientAuthToken(bearer);
	debug(`the cached token is ${authToken._id}`);

	if (bearer) {
		// get the client based on the authToken
		const client = getClient(authToken.client);

		// if the "bearer token" matches the "cached auth token" then the client is verified
		debug(`if ${bearer} == ${authToken._id}`);
		if (bearer == authToken._id) {
			// create the user
			debug("creating user payload");
			const user = await mockFindUser(authToken.user);

			// create a session payload and sign it with the clients secret
			const payload = await genJwtToken(
				{ _id: user._id, email: user.email },
				client.secret
			);

			// the cache token is no longer needed, remove it
			TokenCache.findOneAndDelete({ _id: authToken._id }).then((doc) =>
				debug(`deleted cached token ${doc._id}`)
			);
			return res.status(200).json({ user: payload });
		}
	}
};
