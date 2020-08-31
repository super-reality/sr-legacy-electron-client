import * as AWS from "aws-sdk";
import jsonRpcRemote from "./jsonRpcSend";

export default function uploadFileToS3(
  localFileName: string,
  remotefileName: string
): void {
  // Read content from the file
  jsonRpcRemote("upload_to_aws", {
    local_file: localFileName,
    s3_file: remotefileName,
  }).then((res) => {});
}
