// ##──── About ─────────────────────────────────────────────────────────────────────────────
// controls POST:/auth/processLogin which handles the form {email, password} on the SSO server
// 1. extracts email and password from body
// 2. searches and verifies user details
// 3. sign JWT token under the session details provided by the BEARER session

const { genJwtToken } = require("../helpers/jwt_helper");
const { v4: uuidv4 } = require("uuid");

const query = require("../queries/queryBase");
const Client = require("../mongo/model/clients");
const User = require("../mongo/model/users");
const TokenCache = require("../mongo/model/tokenCache");

const debug = require("debug")("app:processLogin");

const mockFindUser = async (email, password) => {
	// debug(`looking for "${email}"`);
	const filter = { email: email, password: password };

	const user = await query(User, filter);
	return user;
};

// return a imterim token to give back to the client to authorize it
// its the clients job to decode it and send it back
const mockCreateClientAuthToken = (client, user) => {
	return new TokenCache({
		client: client._id,
		user: user._id,
		_id: uuidv4(),
	}).save();
};

const mockGetClient = async (serviceURL) => {
	const serviceURLOrigin = new URL(serviceURL).origin;

	const filter = {
		origin: serviceURLOrigin,
	};

	const client = await query(Client, filter);
	return client;
};

module.exports = async (req, res, next) => {
	debug("processing login");
	const { serviceURL } = await req.query;
	const { email, password } = req.body;

	// get the service url that the request came from
	// lookup the client for this service url
	const client = await mockGetClient(serviceURL);

	// find user
	const user = await mockFindUser(email, password);

	// if user was found matching the email and pass
	if (user) {
		// create a temp cached token on the server that mostly just contains an _id, and a reference for the client and user
		const cacheToken = await mockCreateClientAuthToken(client, user);

		// create a payload to encode into a JWT
		const payloadBody = {
			client: cacheToken.client,
			user: cacheToken.user,
			_id: cacheToken._id,
		};

		// encode the cached tokens _id in a jwt payload encoded it using the clients secret
		const payload = await genJwtToken(payloadBody, client.secret);

		debug(
			`encoded: "${JSON.stringify(
				payloadBody,
				null,
				2
			)}" with the client key: ${client.secret}`
		);

		// now go back to the og source
		// the client now has to decode it to verify itself
		const redirectUrl = `${req.query.serviceURL}?token=${payload}`;
		debug(`redirecting back to: ${new URL(redirectUrl).host}`);
		res.redirect(redirectUrl);
	}
};
