// ! depricated
const debug = require("debug")("app:getSession");
const { genJwtToken } = require("../helpers/jwt_helper");

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

// MOCK
// returns the client
const getClient = (bearer) => {
	return {
		_id: "5f4e0ee4607aa5235a33154b",
		name: "testApp",
		bearer: "j3dlr8jdpke2sh3rlrixzcd3svxo",
	};
};

// MOCK
// gets a session from the database for this client
const getSession = () => {
	// assume that we dont find a session
	return false;
};

// MOCK
// creates and returns a new session
const generateSession = (clientID) => {
	// client: ["5f4e0ee4607aa5235a33154b"],
	return {
		_id: "5f4e66c0f312554472c5ac9d",
		client: [clientID],
	};
};

// getSession is a protected POST only route that requires a signed body to be decoded
// it will only run if the provided sig in the header matches. see middleware/verifypayload.js

module.exports = async (req, res) => {
	debug("getting session");

	const session = getSession();
	if (session) {
		return res.status(200).json(session);
	}

	// grab the bearer token from the header that identifies this client
	const [bearer] = parseBearerToken(req.get("Authorization"));
	if (bearer) {
		const client = getClient(bearer);
		const sessionJWT = generateSession(client._id);
		const payload = await genJwtToken(sessionJWT);
		return res.status(200).json(payload);
	}
};
