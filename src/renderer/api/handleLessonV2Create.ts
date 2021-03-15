import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonV2Create from "./types/lesson-v2/create";
import apiErrorHandler from "./apiErrorHandler";
import { ILessonV2 } from "./types/lesson-v2/lesson";

/* eslint-disable camelcase */
export default function handleLessonV2Create(
  res: AxiosResponse<LessonV2Create | ApiError>
): Promise<ILessonV2> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<LessonV2Create>(res)
      .then((d) => {
        resolve(d.lesson);
      })
      .catch(reject);
  });
}
