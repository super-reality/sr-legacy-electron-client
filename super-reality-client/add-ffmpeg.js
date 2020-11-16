const fs = require("fs");
const os = require("os");
const pathToFfmpeg = require("ffmpeg-static");

const platform = process.env.npm_config_platform || os.platform();
const executableName = platform === "win32" ? "ffmpeg.exe" : "ffmpeg";

fs.copyFile(
  pathToFfmpeg,
  `${__dirname}/public/extra/${executableName}`,
  (err) => {
    if (err) throw err;
  }
);
