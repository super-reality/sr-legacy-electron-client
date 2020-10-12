import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import LessonGet from "./types/lesson-v2/get";
import { ILessonV2 } from "./types/lesson-v2/lesson";

/* eslint-disable camelcase */
export default function handleLessonGet(
  res: AxiosResponse<ApiError | LessonGet>
): Promise<ILessonV2> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<LessonGet>(res)
      .then((d) => resolve(d.lessons))
      .catch(reject);
  });
}
