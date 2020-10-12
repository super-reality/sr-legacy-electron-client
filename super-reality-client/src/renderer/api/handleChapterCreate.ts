import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import ChapterCreate from "./types/chapter/create";

export default function handleChapterCreate(
  res: AxiosResponse<ChapterCreate | ApiError>
): Promise<IChapter> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ChapterCreate>(res)
      .then((d) => resolve(d.chapter))
      .catch(reject);
  });
}
