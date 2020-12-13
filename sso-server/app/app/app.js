const express = require("express");
const errorHandler = require("./errorHandler");
const app = express();
const engine = require("ejs-mate");
const debug = require("debug")("app");
const path = require("path");
const fourofour = require("../routes/404");
const cors = require("cors");
const router = require("../routes");

// ##──── middleware ────────────────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ##──── cors ──────────────────────────────────────────────────────────────────────────────
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.options("*", cors());

// ##──── ejs rendering ─────────────────────────────────────────────────────────────────────
app.engine("ejs", engine);
app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

// ##──── router ────────────────────────────────────────────────────────────────────────────
app.use("/auth", router);

// ##──── root route ────────────────────────────────────────────────────────────────────────
app.get("/", (req, res, next) => {
	debug("root");
	return res.status(200).render("helloWorld", {
		success: true,
	});
});

// ##──── error handling ────────────────────────────────────────────────────────────────────
// catch 404 and forward to error handler
// app.get(fourofour);
// print errors in the browser
// app.use(errorHandler);

module.exports = app;
