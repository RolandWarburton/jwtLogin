const uuidv4 = require("uuid/v4");
const Hashids = require("hashids");
const URL = require("url").URL;
const hashids = new Hashids();
const debug = require("debug")("app:login");
const debug2 = require("debug")("app:dologin");
const debug3 = require("debug")("app:storeApplicationInCache");
const debug4 = require("debug")("app:fillIntrmTokenICache");
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
	simple_sso_consumer: "1g0jJwGmRQhJwvwNOrY4i90kD0m",
};

const alloweOrigin = {
	"http://consumer.ankuranand.in:3020": true,
	"http://devel:3020": true,
	"http://consumertwo.ankuranand.in:3030": true,
	"http://sso.ankuranand.in:3080": false,
};

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, "");
const encodedId = () => hashids.encodeHex(deHyphenatedUUID());

const originAppName = {
	"http://consumertwo.ankuranand.in:3030": "simple_sso_consumer",
	"http://devel:3020": "testApp",
};

// these token are for the validation purpose
const intrmTokenCache = {};

const fillIntrmTokenCache = (origin, id, intrmToken) => {
	const tokenCache = new TokenCache();
	tokenCache.tokenID = intrmToken;
	tokenCache.applicationID = id;
	tokenCache.applicationName = originAppName[origin];
	tokenCache.save();
	debug4(`cached token ${tokenCache.tokenID}`);
	intrmTokenCache[intrmToken] = [id, originAppName[origin]];
};

const storeApplicationInCache = async (origin, id, intrmToken, email) => {
	// debug3("============================================");
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
		session.originAppName[origin] = true;
		session.save();
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
	const email = appPolicy.shareEmail === true ? userEmail : undefined;

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
	const appToken = appTokenFromRequest(req);
	const { ssoToken } = req.query;
	// if the application token is not present or ssoToken request is invalid
	// if the ssoToken is not present in the cache some is
	// smart.
	if (
		appToken == null ||
		ssoToken == null ||
		intrmTokenCache[ssoToken] == null
	) {
		return res.status(400).json({ message: "badRequest" });
	}

	const tokenCache = await getTokenCache(ssoToken);
	const session = await getSession(tokenCache.applicationID);
	// ! fetch the client using its secret
	const client = await getClient(appToken);

	// if the appToken is present and check if it's valid for the application
	const appName = tokenCache.applicationName;

	// ! if the apps token (supplied client secret) !=  the secret of the client from the database
	// ! then return unauthorized
	if (appToken !== client.secret || session.client[appName] !== true) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	// checking if the token passed has been generated
	const payload = await generatePayload(ssoToken);

	const token = await genJwtToken(payload);
	// delete the itremCache key for no futher use,
	TokenCache.deleteOne({ tokenID: ssoToken });
	delete intrmTokenCache[ssoToken];
	return res.status(200).json({ token });
};

const doLogin = async (req, res, next) => {
	debug2("============================================");
	debug2("attempting to log in...");
	// do the validation with email and password
	// but the goal is not to do the same in this right now,
	// like checking with Datebase and all, we are skiping these section
	const { email, password } = req.body;
	debug2(`USERNAME: "${email}"\nPASSWORD: ${password}`);

	// get a user from the database
	const user = await User.findOne(
		{ email: email, password: password },
		(err, user) => {
			if (err) {
				debug2(`An error occurred when looking for a user`);
				return undefined;
			}

			if (!user) {
				debug2(`didnt find a user ${queryValue}`);
				return undefined;
			}

			debug2(`Found user ${user.username}`);
			return user;
		}
	);

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
	debug("============================================");
	debug("responding to log in request");
	// The req.query will have the redirect url where we need to redirect after successful
	// login and with sso token.
	// This can also be used to verify the origin from where the request has came in
	// for the redirection
	const { serviceURL } = req.query;
	debug(`the service url for the login is: ${req.query.serviceURL}`);
	// direct access will give the error inside new URL.
	if (serviceURL != null) {
		const url = new URL(serviceURL);
		if (alloweOrigin[url.origin] !== true) {
			return res.status(400).json({
				message: "Your are not allowed to access the sso-server",
			});
		}
	}
	if (req.session.user != null && serviceURL == null) {
		return res.redirect("/");
	}

	debug(`the user for the global session is: ${req.session.user}`);
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
	debug("waiting for user to enter details");
	return res.render("login", {
		title: "SSO-Server | Login",
	});
};

module.exports = Object.assign({}, { doLogin, login, verifySsoToken });
