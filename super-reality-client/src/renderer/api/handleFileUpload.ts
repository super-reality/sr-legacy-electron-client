import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import FileUpload from "./types/file/upload";

/* eslint-disable camelcase */
export default function handleFileUpload(
  res: AxiosResponse<FileUpload | ApiError>
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<FileUpload>(res)
      .then((d) => resolve(d.urls))
      .catch(reject);
  });
}
