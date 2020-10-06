import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import { ChaptersGet } from "./types/chapter/get";

/* eslint-disable camelcase */
export default function handleChaptersGet(
  res: AxiosResponse<ApiError | ChaptersGet>
): Promise<IChapter[]> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.chapters);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
