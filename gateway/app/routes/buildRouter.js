const express = require("express");

/**
 *
 * @param {Array} controllers - array of express controller functions
 */
const buildRouter = (controllers) => {
	const express = require("express");
	const router = express.Router();
	for (let c of controllers) {
		router.get(c.path, c.route);
	}
	return router;
};
