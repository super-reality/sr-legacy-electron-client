import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonUpdate from "./types/lesson-v2/update";
import { ILessonV2 } from "./types/lesson-v2/lesson";

/* eslint-disable camelcase */
export default function handleLessonUpdate(
  res: AxiosResponse<ApiError | LessonUpdate>
): Promise<ILessonV2> {
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
