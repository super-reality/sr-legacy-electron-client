/* eslint-env jest */
import AWS from "aws-sdk";

require("dotenv").config();

test("Can access Amazon S3 builds", async (done) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  });

  await new Promise((resolve, reject) =>
    s3.listObjects({ Bucket: "super-reality-builds" }, (err: any, d) => {
      if (err) reject();
      else resolve(d);
    })
  )
    .then(() => done())
    .catch(console.error);
});
