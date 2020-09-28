import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonSearchParent, { Parents } from "./types/lesson/search-parent";

export default function handleLessonSearchParent(
  res: AxiosResponse<LessonSearchParent | ApiError>
): Parents[] | undefined {
  if (res.status === 200) {
    if (res.data.err_code === 0) {
      return res.data.parents;
    }
    console.error(`Response error code ${res.data.err_code}`);
  }
  return undefined;
}
