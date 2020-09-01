import fs from "fs";
import axios from "axios";
import { API_URL } from "../renderer/constants";
import FileUpload from "../renderer/api/types/file/upload";
import { ApiError } from "../renderer/api/types";
import handleFileUpload from "../renderer/api/handleFileUpload";

export default function uploadFileToS3(
  localFileName: string,
  type: string = "lesson"
): Promise<string> {
  console.log("upload:", localFileName);
  return new Promise((resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(localFileName);
      const file = new File(
        [fileContent],
        `${Math.floor(Math.random() * 1000).toString()}.png`
      );
      const data = new FormData();
      data.append(type, file);
      axios
        .post<FileUpload | ApiError>(`${API_URL}file/upload`, data)
        .then(handleFileUpload)
        .then((urls) => resolve(urls[0]))
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}
