const debug = require("debug")("app:login");

const re = /(\S+)\s+(\S+)/;

// Note: express http converts all headers
// to lower case.
const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";

// app token to validate the request is coming from the authenticated server only.
const appTokenDB = {
	testApp: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
	blogWatcher: "j3dlr8jdpke2sh3rlrixzcd3svxo",
	blogBuilder: "3imim8awgeq99ikbmg14lnqe0fu8",
};

const fillIntrmTokenCache = (origin, id, intrmToken) => {};

//
const storeApplicationInCache = async (origin, id, intrmToken, email) => {};

// create payload jwt
const generatePayload = async (ssoToken) => {};

const verifySsoToken = async (req, res, next) => {};

// attempt to login
const doLogin = async (req, res, next) => {};

// respond to login
const login = (req, res, next) => {
	return res.status(200).json({ success: true });
};

module.exports = login;
