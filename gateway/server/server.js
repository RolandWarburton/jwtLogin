const express = require("express");
const errorHandler = require("./errorHandler");
const app = express();
const engine = require("ejs-mate");
const debug = require("debug")("app");
const path = require("path");
const buildHelpMiddleware = require("../middleware/buildHelpMiddleware");
const fourofour = require("./404");
const tagBuilderClient = require("../middleware/tagBuilderClient");
const tagWatcherClient = require("../middleware/tagWatcherClient");
const checkReceiveToken = require("../middleware/checkReceivingToken");
const isAuthenticated = require("../middleware/isAuthenticated");
const session = require("express-session");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");

// ##──── express session ───────────────────────────────────────────────────────────────────
const sessionSecret = uuidv4();
const expressSession = session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		// 1 hour
		maxAge: 3600000,
	},
});

// ##──── route imports ─────────────────────────────────────────────────────────────────────
const router = require("../routes");
const v1Builder = require("../api/v1/routes/builder");
const v1Watcher = require("../api/v1/routes/watcher");

// ##──── cors ──────────────────────────────────────────────────────────────────────────────
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.options("*", cors());

// ##──── middleware ────────────────────────────────────────────────────────────────────────
app.use(expressSession);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(checkReceiveToken);

// middleware to present the user with help text for different routes
app.use(buildHelpMiddleware);

// ##──── ejs rendering ─────────────────────────────────────────────────────────────────────
app.engine("ejs", engine);
app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

app.locals.test = "test";

// ##──── router ────────────────────────────────────────────────────────────────────────────
app.use("/api/v1", router);
app.use("/api/v1/build", [isAuthenticated, tagBuilderClient], v1Builder);
app.use("/api/v1/watch", [isAuthenticated, tagWatcherClient], v1Watcher);

// ##──── root route ────────────────────────────────────────────────────────────────────────
app.get("/", (req, res, next) => {
	debug("root");
	return res.status(200).render("index", {
		message: `you are on the gateway router ${req.originalUrl}`,
	});
});

app.get("/logout", (req, res, next) => {
	req.session.destroy();
	res.status(200).send("logged out");
});

// ##──── error handling ────────────────────────────────────────────────────────────────────
// catch 404 and forward to error handler
// app.get(fourofour);
// print errors in the browser
// app.use(errorHandler);

module.exports = app;
