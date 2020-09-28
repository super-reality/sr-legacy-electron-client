/* eslint-disable import/no-extraneous-dependencies */
const AWS = require("aws-sdk");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Website must be built using build:web !

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

function getFileExt(file) {
  const pop = file.split(".").pop();
  if (pop == file) return "";
  return `.${pop || ""}`;
}

function getContentType(file) {
  const ext = getFileExt(file);
  switch (ext) {
    case ".js":
      return "text/javascript";
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".mp3":
      return "audio/mpeg";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    default:
      return undefined;
  }
}

function uploadFileToS3(filename) {
  return new Promise((resolve, reject) => {
    // Read content from the file
    let fileContent;
    try {
      fileContent = fs.readFileSync(path.join(filename));
    } catch (e) {
      reject(e);
    }
    const params = {
      Bucket: "teacher.bot",
      Key: filename.slice(6).replace("\\", "/"),
      Body: fileContent,
      ContentType: getContentType(filename),
    };

    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(`File uploaded: ${data.Location}`);
        resolve(data.Location);
      }
    });
  });
}

function getDirectoryFiles(from) {
  return new Promise((resolve, reject) => {
    glob(from, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function deleteS3Object(object) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket: "teacher.bot", Key: object.Key }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(`File deleted: ${object.Key}`);
        resolve(object.Key);
      }
    });
  });
}

async function main() {
  const data = await new Promise((resolve, reject) =>
    s3.listObjects({ Bucket: "teacher.bot" }, (err, d) => {
      if (err) reject();
      else resolve(d);
    })
  ).catch(console.error);

  const items = data.Contents.map(deleteS3Object);
  await Promise.all(items).catch(console.error);
  console.log(`Bucket cleared (${items.length} files)`);
  console.log("Begin uploading files..");

  const toPush = await getDirectoryFiles("build/**/*")
    .then((files) => files.filter((f) => getFileExt(f) !== ""))
    .catch(console.error);

  console.log(`Found ${toPush.length} files. in /dist`);

  await Promise.all(toPush.map((file) => uploadFileToS3(file))).catch(
    console.error
  );
}

main();
