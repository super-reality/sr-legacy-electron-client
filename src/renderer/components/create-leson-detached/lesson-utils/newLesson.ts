import Axios from "axios";
import handleLessonV2Create from "../../../api/handleLessonV2Create";
import { ApiError } from "../../../api/types";
import LessonV2Create from "../../../api/types/lesson-v2/create";
import { ILessonV2 } from "../../../api/types/lesson-v2/lesson";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";

export default function newLesson(
  lesson: Partial<ILessonV2> & { name: string }
): Promise<void | ILessonV2> {
  const payload = {
    ...lesson,
  };
  return Axios.post<LessonV2Create | ApiError>(
    `${API_URL}lesson/create`,
    payload
  )
    .then(handleLessonV2Create)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETLESSON",
        arg: data,
      });
      return data;
    })
    .catch(console.error);
}
