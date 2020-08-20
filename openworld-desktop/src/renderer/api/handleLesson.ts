import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import ILesson from "./types/schemas/ILesson";

export default function handleLessonCreation(
  res: AxiosResponse<any | ApiError>
) {
  if (res.status === 200) {
    // All ok!
  }
}
