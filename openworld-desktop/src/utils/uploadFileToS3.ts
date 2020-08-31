import * as AWS from "aws-sdk";
import fs from "fs";
import axios from "axios";
import getFileSha1 from "./getFileSha1";
import getFileExt from "./getFileExt";
import { ApiError } from "../renderer/api/types";
import { API_URL } from "../renderer/constants";

// the current publishing codes and flow.
export default function uploadFileToS3(
  localFileName: string,
  remotefileName?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Read content from the file
    const fileContent = fs.readFileSync(localFileName);
    const formData = new FormData();
    formData.append("lesson", new Blob([fileContent], { type: "image/png" }));

    const options = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    // Uploading files to the bucket
    axios
      .post<ApiError | any>(`${API_URL}file/upload`, formData, options)
      .then((res) => {
        resolve(res.data.urls);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
