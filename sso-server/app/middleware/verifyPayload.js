const crypto = require("crypto");
const debug = require("debug")("app:PayloadVerify");
require("dotenv").config();

const secret = process.env.CLIENT_SECRET;
const sigHeaderName = "x-payload-signature";

function verifyPayload(req, res, next) {
	debug("running payload verify middleware");

	// we receive the body as JSON so need to stringify it first
	let sig =
		"sha1=" +
		crypto
			.createHmac("sha1", secret)
			.update(JSON.stringify(req.body))
			.digest("hex");

	debug(`sig: ${sig}`);
	debug(`sig: ${req.headers[sigHeaderName]}`);

	if (req.headers[sigHeaderName] == sig) {
		debug("all good");
	} else {
		debug("all bad");
		return res.status(500).json({ success: false });
	}
	return next();
}

module.exports = verifyPayload;
