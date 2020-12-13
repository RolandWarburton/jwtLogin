const app = require("./server/server");
const ip = require("internal-ip");
const { exec } = require("child_process");
require("dotenv").config();

// exec("kill -9 $(/usr/bin/lsof -i tcp:3001 -t)", (error, stdout, stderr) => {
// 	if (error) {
// 		console.log(`error: ${error.message}`);
// 		return;
// 	}
// 	if (stderr) {
// 		console.log(`stderr: ${stderr}`);
// 		return;
// 	}
// 	console.log(`stdout: ${stdout}`);
// });

// try {
// 	execSync("");
// } catch (err) {}

app.listen(process.env.PORT, () => {
	console.info(`sso-server listening on ${ip.v4.sync()}:${process.env.PORT}`);
});
