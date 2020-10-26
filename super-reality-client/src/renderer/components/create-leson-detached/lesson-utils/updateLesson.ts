import Axios from "axios";
import _ from "lodash";
import handleLessonUpdate from "../../../api/handleLessonV2update";
import { ApiError } from "../../../api/types";
import { ILessonV2 } from "../../../api/types/lesson-v2/lesson";
import LessonUpdate from "../../../api/types/lesson-v2/update";
import { API_URL } from "../../../constants";
import store from "../../../redux/stores/renderer";

export default function updateLesson(data: Partial<ILessonV2>, id: string) {
  const updated = store.getState().createLessonV2.treeLessons[id];
  const newData = {
    chapters: updated.chapters,
    ...data,
    lesson_id: id,
  };

  Axios.put<LessonUpdate | ApiError>(
    `${API_URL}lesson`,
    _.omit(newData, ["_id", "__v", "createdBy", "createdAt", "updatedAt"])
  )
    .then(handleLessonUpdate)
    .catch(console.error);
}
