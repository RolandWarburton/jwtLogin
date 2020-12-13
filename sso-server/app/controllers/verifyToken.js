const { genJwtToken } = require("../helpers/jwt_helper");
const signPyaload = require("../helpers/signPyaload");
const debug = require("debug")("app:verifToken");
const { v4: uuidv4 } = require("uuid");

const query = require("../queries/queryBase");
const User = require("../mongo/model/users");
const TokenCache = require("../mongo/model/tokenCache");
const Session = require("../mongo/model/sessions");
const Client = require("../mongo/model/clients");

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

const findUser = async (_id) => {
	const filter = { _id: _id };
	const user = await query(User, filter);
	return user;
};

// return the token from the auth token cache
const getClientAuthToken = async (_id) => {
	const filter = {
		_id: _id,
	};
	const token = await query(TokenCache, filter, { castID: false });
	return token;
};

const getClient = async (_id) => {
	const filter = {
		_id: _id,
	};
	const client = await query(Client, filter, { castID: true });
	return client;
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
		const client = await getClient(authToken.client);

		// if the "bearer token" matches the "cached auth token" then the client is verified
		debug(`if ${bearer} == ${authToken._id}`);
		if (bearer == authToken._id) {
			// create the user
			debug("creating user payload");
			const user = await findUser(authToken.user);

			// // not sure what to do with this
			// create a session
			// the purpose of storing the session locally is just for logging purposes right now
			const session = await new Session({
				user: user._id,
				client: client._id,
				_id: uuidv4(),
				timestamp: new Date(),
			}).save();

			// when adding new app policy to the user, remember to add the client ID to the {User.appPolicy} schema as well
			const appPolicy = user.appPolicy[client._id];
			debug(`appPolicy is: ${JSON.stringify(appPolicy)}`);

			// create a session payload and sign it with the clients secret
			const payload = await genJwtToken(
				{ _id: user._id, policy: appPolicy, sessionID: session._id },
				client.secret
			);

			// the cache token is no longer needed, remove it
			TokenCache.findOneAndDelete({ _id: authToken._id }).then((doc) =>
				debug(`deleted cached token ${doc._id}`)
			);
			debug(`returning user id details in payload`);
			return res.status(200).json({ token: payload });
		}
	}
};
