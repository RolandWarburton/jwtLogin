const express = require("express");
const morgan = require("morgan");
const app = express();
const engine = require("ejs-mate");
const session = require("express-session");
const debug = require("debug")("app:server");

const isAuthenticated = require("./isAuthenticated");
const checkSSORedirect = require("./checkSSORedirect");

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.engine("ejs", engine);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(checkSSORedirect());

app.get("/", isAuthenticated, (req, res, next) => {
	const now = new Date().toISOString();
	debug(`This session is: ${req.session.id}`);
	res.render("index", {
		what: `SSO-Consumer One`,
		role: req.session.user.role,
		email: req.session.user.email,
		uid: req.session.user.uid,
		globalSessionID: req.session.user.globalSessionID,
		iat: req.session.user.iat,
		exp: req.session.user.exp,
		iss: req.session.user.iss,
		title: "SSO-Consumer | Home",
		cookie: JSON.stringify(req.session.cookie) || "not sure",
		expires: req.session.cookie.maxAge / 1000 + "'s",
		the_whole_shebang: JSON.stringify(req.session.user),
	});
});

app.get("/logout", isAuthenticated, (req, res, next) => {
	req.session.destroy();
	res.status(200).send("logged out");
});

app.use((req, res, next) => {
	// catch 404 and forward to error handler
	const err = new Error("Resource Not Found");
	err.status = 404;
	next(err);
});

// catch errors
app.use((err, req, res, next) => {
	const statusCode = err.status || 500;
	let message = err.message || "Internal Server Error";

	if (statusCode === 500) {
		message = "Internal Server Error";
	}
	res.status(statusCode).json({ message });
});

module.exports = app;
