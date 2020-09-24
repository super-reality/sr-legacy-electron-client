const fs = require("fs");

fs.rmdirSync("dist/win-unpacked", { recursive: true });
fs.unlinkSync("craco.config.js");
