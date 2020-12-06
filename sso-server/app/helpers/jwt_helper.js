const jwt = require("jsonwebtoken");

const ISSUER = "simple-sso";

const genJwtToken = (payload, secret = "secretPrivateCert") =>
	new Promise((resolve, reject) => {
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
