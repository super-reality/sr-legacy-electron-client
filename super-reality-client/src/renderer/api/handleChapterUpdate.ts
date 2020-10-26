import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import ChapterUpdate from "./types/chapter/update";

/* eslint-disable camelcase */
export default function handleChapterUpdate(
  res: AxiosResponse<ChapterUpdate | ApiError>
): Promise<IChapter> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ChapterUpdate>(res)
      .then((d) => resolve(d.chapter))
      .catch(reject);
  });
}
