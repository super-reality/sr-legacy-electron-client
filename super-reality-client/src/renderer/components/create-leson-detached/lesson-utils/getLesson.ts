import Axios from "axios";
import handleLessonGet from "../../../api/handleLessonV2Get";
import { ApiError } from "../../../api/types";
import LessonGet from "../../../api/types/lesson-v2/get";
import { ILessonV2 } from "../../../api/types/lesson-v2/lesson";
import { API_URL } from "../../../constants";

export default function getLesson(id: string): Promise<ILessonV2> {
  return new Promise((resolve, reject) => {
    Axios.get<LessonGet | ApiError>(`${API_URL}lesson/${id}`)
      .then(handleLessonGet)
      .then(resolve)
      .catch(reject);
  });
}
