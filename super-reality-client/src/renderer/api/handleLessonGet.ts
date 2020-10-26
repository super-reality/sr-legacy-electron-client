import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import LessonGet from "./types/lesson/get";

/* eslint-disable camelcase */
export default function handleLessonGet(
  res: AxiosResponse<LessonGet | ApiError>
): Promise<LessonGet> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<LessonGet>(res)
      .then((d) => resolve(d))
      .catch(reject);
  });
}
