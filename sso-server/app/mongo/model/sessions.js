var mongoose = require("mongoose");

// Model
const modelName = "sessions";

// Schema
const schemaDefinition = require("../schema/" + modelName);

// Generate a mongoose schema and model
const schemaInstance = mongoose.Schema(schemaDefinition, {
	versionKey: false,
	_id: false,
});
const modelInstance = mongoose.model(modelName, schemaInstance);

// export the mongoose model
module.exports = modelInstance;
