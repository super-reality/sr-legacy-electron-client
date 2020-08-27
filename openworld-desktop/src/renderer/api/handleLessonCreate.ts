import { ApiError } from "./types";
import { LessonResp } from "./types/lesson/create";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleLessonCreate(
  res: ApiError | LessonResp
): Promise<string> {
  return new Promise((resolve, eject) => {
    if (res.err_code == 0) {
      resolve(res.lesson._id);
    } else {
      eject();
    }
  });
}
