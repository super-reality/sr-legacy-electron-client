import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonSearch from "./types/lesson/search";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleDiscoverSearch(
  res: AxiosResponse<ApiError | LessonSearch>
): Promise<LessonSearch> {
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
