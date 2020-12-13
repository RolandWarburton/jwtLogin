const express = require("express");
const app = express();
const engine = require("ejs-mate");
const errorHandler = require("./errorHandler");
const debug = require("debug")("app:server");
const path = require("path");
const isAuthenticated = require("../middleware/isAuthenticated");
const cookieParser = require("cookie-parser");
const checkReceiveToken = require("../middleware/checkReceivingToken");
const session = require("express-session");

// ##──── middleware ────────────────────────────────────────────────────────────────────────
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 100000,
		},
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(checkReceiveToken);

// ##──── ejs rendering ─────────────────────────────────────────────────────────────────────
app.engine("ejs", engine);
app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

// ##──── root route ────────────────────────────────────────────────────────────────────────
app.get("/", [isAuthenticated], (req, res, next) => {
	debug("root");

	// print information about the session
	// debug(req.session.user);
	// debug(`This session is: ${req.session.id}`);

	res.render("helloWorld", {
		test: "hello world",
	});
});

app.get("/logout", (req, res, next) => {
	req.session.destroy();
	res.status(200).send("logged out");
});

// ##──── error handling ────────────────────────────────────────────────────────────────────
// catch 404 and forward to error handler
// app.use(errorHandler);

module.exports = app;
