import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonGet, { ILessonGet } from "./types/lesson/get";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleLessonGet(
  res: AxiosResponse<ApiError | LessonGet>
): Promise<ILessonGet> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.lesson);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
