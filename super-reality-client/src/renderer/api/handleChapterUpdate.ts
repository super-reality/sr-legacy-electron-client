import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import ChapterUpdate from "./types/chapter/update";

/* eslint-disable camelcase */
export default function handleChapterUpdate(
  res: AxiosResponse<ApiError | ChapterUpdate>
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
