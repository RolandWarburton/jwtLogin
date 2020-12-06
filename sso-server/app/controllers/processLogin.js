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
	// const userDatabase = [
	// 	{
	// 		_id: "abc123",
	// 		email: "a@a",
	// 		password: "a",
	// 	},
	// ];

	// // find the user
	// const user = userDatabase.find((user) => user.email == email);

	// // return the user
	// return user;
};

// const mockCreateSession = () => {
// 	return {
// 		_id: "sessionid",
// 	};
// };

// return a imterim token to give back to the client to authorize it
// its the clients job to decode it and send it back
const mockCreateClientAuthToken = (client, user) => {
	return new TokenCache({
		client: client._id,
		user: user._id,
		// token: uuidv4(),
		_id: "8868215a-c935-4e61-aa23-61f51821cc00",
	}).save();
	// .then((doc) => {
	// 	return doc;
	// });

	// await token.save({}, (err, doc) => {
	// 	if (err) {
	// 		debug(err);
	// 		return undefined;
	// 	}
	// 	return doc;
	// });

	// return token;

	// return token;

	debug4(`cached token ${tokenCache.tokenID}`);
	// generate this in the database and return the _id
	// const _id = uuidv4();
	const _id = "8868215a-c935-4e61-aa23-61f51821cc00";
	const payload = {
		_id: _id,
		client: client._id,
		user: user._id,
	};
	return payload;
};

// const mockGetSession = () => {
// 	return {
// 		token:
// 			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2MDcxNzYwMDEsImV4cCI6MTYwNzE3OTYwMSwiaXNzIjoic2ltcGxlLXNzbyJ9.04YjGstXKsNgyhy757kkYjSrLNkUSwYzd_5POkvrDWE",
// 	};
// };

const mockGetClient = async (serviceURL) => {
	const serviceURLOrigin = new URL(serviceURL).origin;

	const filter = {
		origin: serviceURLOrigin,
	};

	const client = await query(Client, filter);
	return client;
	// debug(client);
	// const result = {
	// 	_id: "5f4e0ee4607aa5235a33154b",
	// 	secret: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
	// };
	// return result;
};

module.exports = async (req, res, next) => {
	debug("processing login");
	// debug(req.query);
	// debug(req.query.serviceURL);
	const { serviceURL } = await req.query;

	// get the service url that the request came from
	// const serviceURL = req.query.serviceURL;
	// lookup the client for this service url
	const client = await mockGetClient(serviceURL);

	const { email, password } = req.body;

	// find user
	const user = await mockFindUser(email, password);

	// if user was found matching the email and pass
	if (user) {
		// create a temp cached token on the server that mostly just contains an _id, and a reference for the client and user
		const cacheToken = await mockCreateClientAuthToken(client, user);

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
		// return res.status(200).json({ token: payload });
	}
	// for now pass the users details back to them
	// {email: "warburtonroland@gmail.com", password: "p@ssw0rd"}
	// return res.status(400).json({ message: "failed to login" });
};
