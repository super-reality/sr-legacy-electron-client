import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import { ChapterGet } from "./types/chapter/get";

/* eslint-disable camelcase */
export default function handleChapterGet(
  res: AxiosResponse<ApiError | ChapterGet>
): Promise<IChapter> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.chapter);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
