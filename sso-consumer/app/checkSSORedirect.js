const url = require("url");
const axios = require("axios");
const debug = require("debug")("app:checkSSORedirect");
const { verifyJwtToken } = require("./jwt_verify");
const ssoServerJWTURL = "http://devel:3010/simplesso/verifytoken";

// TODO Do some validation that the origin of the request came from the SSO server
const validReferOrigin = "http://devel:3010";

const ssoRedirect = () => {
	return async function (req, res, next) {
		debug("running checkSSORedirect");

		// ! the sso token is passed to the client when the client is authenticating with the sso server.
		// ! This client then sends a response back to the "ssoServerJWTURL" to validate its receipt of the token using its Client secret (Bearer secret)
		const { ssoToken } = req.query;
		debug(`ssoToken: "${ssoToken}"`);

		if (ssoToken != null) {
			debug(`the token exists!`);
			// get the ssoToken in query parameter redirect.
			const redirectURL = url.parse(req.url).pathname;
			try {
				debug(`requesting the decoded token for "${ssoToken}"`);
				const response = await axios.get(
					`${ssoServerJWTURL}?ssoToken=${ssoToken}`,
					{
						headers: {
							Authorization:
								"Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
						},
					}
				);
				const { token } = response.data;
				const decoded = await verifyJwtToken(token);
				debug(`received the token"`);
				req.session.user = decoded;
			} catch (err) {
				debug("ERRRRRRROR D:");
				return next(err);
			}

			debug(`redirecting to: "${redirectURL}"`);
			return res.redirect(`${redirectURL}`);
		}

		return next();
	};
};

module.exports = ssoRedirect;
