import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import ChapterCreate from "./types/chapter/create";

export default function handleChapterCreate(
  res: AxiosResponse<ChapterCreate | ApiError>
) {
  return new Promise((resolve, reject) => {
    if (res.status == 200 && res.data.err_code == 0) {
      resolve();
    } else {
      reject();
    }
  });
}
