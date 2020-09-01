const url = require("url");
const axios = require("axios");
const debug = require("debug")("app:checkSSORedirect");
const { URL } = url;
const { verifyJwtToken } = require("./jwt_verify");
const validReferOrigin = "http://devel:3010";
const ssoServerJWTURL = "http://devel:3010/simplesso/verifytoken";

const ssoRedirect = () => {
	return async function (req, res, next) {
		debug("============================================");
		debug("running checkSSORedirect");
		// check if the req has the queryParameter as ssoToken
		// and who is the referer.
		const { ssoToken } = req.query;
		debug(`ssoToken: "${ssoToken}"`);

		if (ssoToken != null) {
			debug(`the token exists!`);
			// to remove the ssoToken in query parameter redirect.
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
				debug(`received the token as: "${token}"`);
				const decoded = await verifyJwtToken(token);
				debug(`decoded it as: "${decoded}"`);
				// now that we have the decoded jwt, use the,
				// global-session-id as the session id so that
				// the logout can be implemented with the global session.
				debug(
					`set "${decoded}" (global session ID) as the user for this session`
				);
				req.session.user = decoded;
			} catch (err) {
				debug("ERRRRRRROR");
				return next(err);
			}

			debug(`redirecting to: "${redirectURL}"`);
			return res.redirect(`${redirectURL}`);
		}

		return next();
	};
};

module.exports = ssoRedirect;
