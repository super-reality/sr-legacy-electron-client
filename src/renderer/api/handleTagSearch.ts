import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonCreate from "./types/lesson/create";

export default function handleTagSearch(
  res: AxiosResponse<LessonCreate | ApiError>
) {
  console.log(res);
  if (res.status === 200) {
    //
  }
}
