import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import FileUpload from "./types/file/upload";

/* eslint-disable camelcase */
export default function handleFileUpload(
  res: AxiosResponse<ApiError | FileUpload>
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.urls);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
