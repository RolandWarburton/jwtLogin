const uuidv4 = require("uuid/v4");
const Hashids = require("hashids");
const URL = require("url").URL;
const hashids = new Hashids();
const debug = require("debug")("app:login");
const debug2 = require("debug")("app:dologin");
const debug3 = require("debug")("app:storeApplicationInCache");
const debug4 = require("debug")("app:fillIntrmTokenICache");
const debug5 = require("debug")("verifySSO");
const { genJwtToken } = require("./jwt_helper");
const getSession = require("./getSession");
const getUser = require("./getUser");
const getClient = require("./getClient");
const getTokenCache = require("./getTokenCache");

const Session = require("../mongo/model/sessions");
const TokenCache = require("../mongo/model/tokenCache");
const User = require("../mongo/model/users");
// const session = require("express-session");

const re = /(\S+)\s+(\S+)/;

// Note: express http converts all headers
// to lower case.
const AUTH_HEADER = "authorization";
const BEARER_AUTH_SCHEME = "bearer";

function parseAuthHeader(hdrValue) {
	if (typeof hdrValue !== "string") {
		return null;
	}
	const matches = hdrValue.match(re);
	return matches && { scheme: matches[1], value: matches[2] };
}

const fromAuthHeaderWithScheme = function (authScheme) {
	const authSchemeLower = authScheme.toLowerCase();
	return function (request) {
		let token = null;
		if (request.headers[AUTH_HEADER]) {
			const authParams = parseAuthHeader(request.headers[AUTH_HEADER]);
			if (
				authParams &&
				authSchemeLower === authParams.scheme.toLowerCase()
			) {
				token = authParams.value;
			}
		}
		return token;
	};
};

const fromAuthHeaderAsBearerToken = function () {
	return fromAuthHeaderWithScheme(BEARER_AUTH_SCHEME);
};

const appTokenFromRequest = fromAuthHeaderAsBearerToken();

// app token to validate the request is coming from the authenticated server only.
const appTokenDB = {
	testApp: "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
	blogWatcher: "j3dlr8jdpke2sh3rlrixzcd3svxo",
	blogBuilder: "3imim8awgeq99ikbmg14lnqe0fu8",
};

const alloweOrigin = {
	"http://devel:3020": true,
	"https://build.rolandw.dev": true,
	"https://watch.rolandw.dev": true,
};

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, "");
const encodedId = () => hashids.encodeHex(deHyphenatedUUID());

const originAppName = {
	"https://build.rolandw.dev": "blogBuilder",
	"https://watch.rolandw.dev": "blogWatcher",
	"http://devel:3020": "testApp",
};

const fillIntrmTokenCache = (origin, id, intrmToken) => {
	const tokenCache = new TokenCache();
	tokenCache.tokenID = intrmToken;
	tokenCache.applicationID = id;
	tokenCache.applicationName = originAppName[origin];
	tokenCache.save();
	debug4(`cached token ${tokenCache.tokenID}`);
};

const storeApplicationInCache = async (origin, id, intrmToken, email) => {
	debug3("inspecting the session interim id in the cache");

	const newSession = new Session();

	// retrieve this session
	const session = await getSession(id);

	// if the sessions id is null. Create it
	if (!session) {
		newSession.client = { [originAppName[origin]]: true };
		newSession.sessionID = id;
		newSession.uid = email;
		newSession.save();

		debug3(
			`There is no session app id. Created one "${newSession.sessionID}"`
		);

		debug3(`now we need to add an interim token to the cache...`);
		fillIntrmTokenCache(origin, id, intrmToken);
	} else {
		debug("there was an existing session");
		try {
			Session.updateOne(
				{ sessionID: session.sessionID },
				{ $set: { client: { [originAppName[origin]]: true } } },
				(err) => {
					if (err) debug(err);
					else
						debug(
							`updated sessions client for client ${origin} to true`
						);
				}
			);
		} catch (err) {
			debug(err);
		}
		debug3(`now we need to add an interim token to the cache...`);
		fillIntrmTokenCache(origin, id, intrmToken);
	}
};

const generatePayload = async (ssoToken) => {
	// get all the bits we need
	const tokenCache = await getTokenCache(ssoToken);
	const session = await getSession(tokenCache.applicationID);
	const dbUser = await getUser({ email: session.uid });

	// construct some data with it
	const globalSessionToken = tokenCache.applicationID;
	const appName = tokenCache.applicationName;
	const userEmail = dbUser.email;
	const user = dbUser;
	const appPolicy = user.appPolicy[appName];

	// example of controlling the shareEmail permission
	let email = undefined;
	if (appPolicy && appPolicy.shareEmail === true) email = userEmail;

	// ship it!
	const payload = {
		...{ ...appPolicy },
		...{
			email,
			shareEmail: undefined,
			uid: user.userId,
			// global SessionID for the logout functionality.
			globalSessionID: globalSessionToken,
		},
	};
	return payload;
};

const verifySsoToken = async (req, res, next) => {
	debug5("verifying sso token");
	const appToken = appTokenFromRequest(req);
	const { ssoToken } = req.query;
	const cachedToken = await getTokenCache(ssoToken);

	debug5(`appToken: ${appToken}`);
	debug5(`ssoToken: ${ssoToken}`);
	debug5(`cachedToken: ${cachedToken}`);

	// ? if the app token cant be extracted from the request
	// ? if the sso token doesnt exist
	// ? if the cached token cant be found
	if (appToken == null || ssoToken == null || cachedToken == null) {
		debug5("old or missing token. returning 400");
		return res.status(400).json({ message: "badRequest" });
	}

	// fetch the token
	// const cachedToken = await getTokenCache(ssoToken);
	// fetch the session and then use it to get the client
	const session = await getSession(cachedToken.applicationID);
	// fetch the client using the appToken received from the request,
	// client will return if it authenticates with the correct bearer ID / client secret
	const client = await getClient(appToken);

	// get the name of the application to cross ref it against the session (the client the session is referencing)
	const appName = cachedToken.applicationName;

	// ! if the app token (presented by the client bearer) != the secret of the client from the database
	// ! OR the session does not contain the particular client that this session is authenticating
	// ! then return unauthorized
	if (appToken !== client.secret || session.client[appName] !== true) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	// generate a payload
	const payload = await generatePayload(ssoToken);

	// encode the payload in a JWT to send back to the client
	const token = await genJwtToken(payload);

	// ? The purpose of the tokenCache is to track the communication between the client and auth server
	// ? A new cache token is created when the client is requesting user information (authenticating)
	// ?and is then no longer needed after it has authenticated and the JWT payload has been sent to the client
	// delete the cached token, no futher use for it,

	// TokenCache.deleteOne({ tokenID: ssoToken }, (err) => {
	// 	if (err) debug(err);
	// 	else debug(`deleted tokenCache tokenID:${ssoToken}`);
	// });
	return res.status(200).json({ token });
};

const doLogin = async (req, res, next) => {
	debug2("attempting to log in...");
	// do the validation with email and password
	// but the goal is not to do the same in this right now,
	// like checking with Datebase and all, we are skiping these section
	const { email, password } = req.body;
	debug2(`USERNAME: "${email}"\nPASSWORD: ${password}`);

	// get a user from the database
	const user = await getUser({ email: email, password: password });

	if (!user) {
		debug2(
			"The username or password was INCORRECT. returning 404 Invalid email and password"
		);
		return res.status(404).json({ message: "Invalid email and password" });
	}

	debug2("The user details are correct.");
	// else redirect
	const { serviceURL } = req.query;
	debug2(`will redirect to serviceURL: "${serviceURL}"`);

	const id = encodedId();
	req.session.user = id;
	debug2(`set the req.session.user to ${id}`);

	if (serviceURL == null) {
		return res.redirect("/");
	}
	const url = new URL(serviceURL);
	const intrmid = encodedId();
	debug2(`generated intrim id: "${intrmid}"`);

	debug(`adding application to the cache`);
	storeApplicationInCache(url.origin, id, intrmid, email);
	return res.redirect(`${serviceURL}?ssoToken=${intrmid}`);
};

const login = (req, res, next) => {
	// debug("============================================");
	debug("responding to log in request");
	// The req.query will have the redirect url where we need to redirect after successful
	// login and with sso token.
	// This can also be used to verify the origin from where the request has came in
	// for the redirection
	const { serviceURL } = req.query;
	// debug(`the service url for the login is: ${req.query.serviceURL}`);
	// direct access will give the error inside new URL.
	if (serviceURL != null) {
		const url = new URL(serviceURL);
		if (alloweOrigin[url.origin] !== true) {
			return res.status(400).json({
				message: "Your are not allowed to access the sso-server",
				serviceURL: url.origin,
			});
		}
	}

	if (req.session.user != null && serviceURL == null) {
		return res.redirect("/");
	}

	// debug(`the user for the global session is: ${req.session.user}`);
	// if global session already has the user directly redirect with the token
	if (req.session.user != null && serviceURL != null) {
		debug(
			`the user was found inside the global session of the auth server...`
		);
		const url = new URL(serviceURL);
		// this is a temporary ID
		const intrmid = encodedId();
		debug(`signer a temp id of ${intrmid}`);
		storeApplicationInCache(url.origin, req.session.user, intrmid);
		return res.redirect(`${serviceURL}?ssoToken=${intrmid}`);
	}

	debug("the user is undefined so rendering the login screen");
	// debug("waiting for user to enter details");
	return res.render("login", {
		title: "SSO-Server | Login",
	});
};

module.exports = Object.assign({}, { doLogin, login, verifySsoToken });
