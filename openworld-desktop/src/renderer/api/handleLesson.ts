import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonCreate from "./types/lesson/lesson";

export default function handleLessonCreation(
  res: AxiosResponse<LessonCreate | ApiError>
) {
  if (res.status === 200) {
    // All ok!
  }
}
