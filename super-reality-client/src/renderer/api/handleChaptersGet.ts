import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import { ChaptersGet } from "./types/chapter/get";

/* eslint-disable camelcase */
export default function handleChaptersGet(
  res: AxiosResponse<ChaptersGet | ApiError>
): Promise<IChapter[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ChaptersGet>(res)
      .then((d) => resolve(d.chapters))
      .catch(reject);
  });
}
