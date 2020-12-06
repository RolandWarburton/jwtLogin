const jwt = require("jsonwebtoken");

const ISSUER = "simple-sso";

const genJwtToken = (payload, secret = "secretPrivateCert") =>
	new Promise((resolve, reject) => {
		// some of the libraries and libraries written in other language,
		// expect base64 encoded secrets, so sign using the base64 to make
		// jwt useable across all platform and langauage.
		jwt.sign(
			{ ...payload },
			secret,
			{
				expiresIn: "1h",
				issuer: ISSUER,
			},
			(err, token) => {
				if (err) return reject(err);
				return resolve(token);
			}
		);
	});

module.exports = Object.assign({}, { genJwtToken });
