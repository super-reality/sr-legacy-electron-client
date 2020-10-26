import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonUpdate from "./types/lesson-v2/update";
import { ILessonV2 } from "./types/lesson-v2/lesson";
import apiErrorHandler from "./apiErrorHandler";

/* eslint-disable camelcase */
export default function handleLessonUpdate(
  res: AxiosResponse<ApiError | LessonUpdate>
): Promise<ILessonV2> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<LessonUpdate>(res)
      .then((d) => resolve(d.lesson))
      .catch(reject);
  });
}
