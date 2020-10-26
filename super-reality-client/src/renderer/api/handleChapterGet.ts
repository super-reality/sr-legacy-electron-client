import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import { ChapterGet } from "./types/chapter/get";

/* eslint-disable camelcase */
export default function handleChapterGet(
  res: AxiosResponse<ChapterGet | ApiError>
): Promise<IChapter> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ChapterGet>(res)
      .then((d) => resolve(d.chapters))
      .catch(reject);
  });
}
