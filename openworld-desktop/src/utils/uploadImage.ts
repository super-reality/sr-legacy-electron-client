import * as AWS from "aws-sdk";

const fs = require("fs");
// Enter copied or downloaded access ID and secret key here
const ID = "AKIAR5KZMOTEB45JUE45";
const SECRET = "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";
// The name of the bucket that you have created
const BUCKET_NAME = "openverse-lms";
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});
export default function uploadFileToS3(
  localFileName: string,
  remotefileName: string
): void {
  // Read content from the file
  const fileContent = fs.readFileSync(localFileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: remotefileName, // File name you want to save as in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err: any, data: any) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
}
