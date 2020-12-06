const app = require("./app/app");
require("dotenv").config();

app.listen(process.env.PORT, () => {
	console.info(`sso-consumer listening on port ${process.env.PORT}`);
});
