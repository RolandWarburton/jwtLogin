const express = require("express");
const buildController = require("../../../controllers/buildController");
const router = express.Router();
const loadRoutes = require("../../loadRoutes");

const routes = loadRoutes("./api/v1/routes/watch.rolandw.dev.json");

// ##──── Custom bits ───────────────────────────────────────────────────────────────────────
// when we need to build a special case route that has multiple params or something we can build it
// const urlAppender = (req, res) => {
// 	// return "/pageName/home";
// 	return "";
// };

// ##──── controllers ───────────────────────────────────────────────────────────────────────
const routeRequest = require("../../../controllers/routeRequest");
routes.get("*", routeRequest).post("*", routeRequest);

// const addRoute = require("../../addRoute");
// addRoute("./api/v1/routes/watcherRoutes.json", {
// 	path: "/test",
// 	method: "get",
// });

// ##──── routes ────────────────────────────────────────────────────────────────────────────
// router.get("/watcher", routeRequest);
// router.get("/pages/:c/:a", routeRequest);

// const pagesRouteC = buildController("/pages", urlAppender);
// router.get(pagesRouteC.path, pagesRouteC.controller);

// ##──── exports ───────────────────────────────────────────────────────────────────────────
module.exports = routes;
