const fs = require("fs");

fs.rmdirSync("dist/win-unpacked", { recursive: true });

const branchName =
  process.env.TRAVIS_BRANCH || process.env.TRAVIS_BUILD_NUMBER || "";
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
