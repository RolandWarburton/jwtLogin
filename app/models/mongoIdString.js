const yup = require("yup");

const _id = yup
	.string()
	.test("len", "Must be exactly 5 characters", (val) => val.length === 24)
	.required();

module.exports = _id;
