const fs = require("fs");
const path = require("path");

fs.rmdirSync("dist/win-unpacked", { recursive: true });

const { exec } = require("child_process");

exec("git branch --show-current", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  }
  if (typeof stdout === "string") {
    const branchName = stdout.trim();
    console.log(`Current branch is "${branchName}"`);

    const files = fs.readdirSync("dist/");

    files.forEach((file) => {
      const splitFile = file.split(".");
      const fileFormat = splitFile[splitFile.length - 1];
      const newName = `${splitFile
        .slice(0, -1)
        .join(".")}-${branchName}.${fileFormat}`;
      fs.rename(`dist/${file}`, `dist/${newName}`, (e) => console.error(e));
    });
  }
});
