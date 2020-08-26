/* eslint-disable import/no-extraneous-dependencies */
const fs = require("fs");
const imgur = require("imgur");

imgur.setClientId("037c98456c9f3dd");
const snapshotsDir = "./src/__tests__/__image_snapshots__/__diff_output__/";

function tryUpload(file) {
  imgur
    .uploadFile(snapshotsDir + file)
    .then((json) => {
      console.log(`Uploaded ${file} to: ${json.data.link}`);
    })
    .catch((err) => {
      console.error(err.message);
    });
}

fs.readdir(snapshotsDir, (err, files) => {
  if (files.length > 0) {
    console.log("--------------------------------------------------");
    console.log("Uploading Visual regression test results to IMGUR:");
    console.log("");
  }
  files.forEach(tryUpload);
});

console.log("");
