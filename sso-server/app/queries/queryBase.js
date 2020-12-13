const debug = require("debug")("app:query");
const mongoose = require("mongoose");

const query = async (Schema, filter, options = { castID: true }) => {
	const keys = Object.keys(filter);

	if (options.castID) {
		// cast any _id string to mongoose object id
		keys.filter((key) => {
			if (key == "_id") {
				filter._id = mongoose.Types.ObjectId(filter._id);
			}
		});
	}

	return Schema.findOne(filter, (err, doc) => {
		if (err) {
			debug(`An error occurred when looking for the document`);
			return undefined;
		}

		if (!doc) {
			debug(`could not find doc`);
			return undefined;
		}

		return doc;
	});
};

module.exports = query;
