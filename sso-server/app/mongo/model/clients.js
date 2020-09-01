var mongoose = require("mongoose");

// Model
const modelName = "clients";

// Schema
const schemaDefinition = require("../schema/" + modelName);

// Generate a mongoose schema and model
const schemaInstance = mongoose.Schema(schemaDefinition);
const modelInstance = mongoose.model(modelName, schemaInstance);

// export the mongoose model
module.exports = modelInstance;
