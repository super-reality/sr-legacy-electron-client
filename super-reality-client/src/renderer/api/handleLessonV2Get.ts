import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonGet from "./types/lesson-v2/get";
import { ILessonV2 } from "./types/lesson-v2/lesson";

/* eslint-disable camelcase */
export default function handleLessonGet(
  res: AxiosResponse<ApiError | LessonGet>
): Promise<ILessonV2> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data.lessons);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
