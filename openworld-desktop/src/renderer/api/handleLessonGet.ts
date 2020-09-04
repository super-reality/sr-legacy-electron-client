import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonGet from "./types/lesson/get";

/* eslint-disable camelcase */
export default function handleLessonGet(
  res: AxiosResponse<ApiError | LessonGet>
): Promise<LessonGet> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
