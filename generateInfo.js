const fs = require("fs");
const { exec } = require("child_process");

function generateInfo(branchName) {
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));

  const informationObject = {
    version: process.argv[1] || packageJson.version,
    branch: branchName,
    timestamp: new Date().getTime(),
  };

  fs.writeFileSync("./src/info.json", JSON.stringify(informationObject));
}

exec("git rev-parse --abbrev-ref HEAD", (err, stdout) => {
  if (err) {
    console.log(err);
  } else if (typeof stdout === "string") {
    const branchName =
      process.env.TRAVIS_BRANCH ||
      process.env.TRAVIS_BUILD_NUMBER ||
      stdout.trim();

    generateInfo(branchName);
  }
});
