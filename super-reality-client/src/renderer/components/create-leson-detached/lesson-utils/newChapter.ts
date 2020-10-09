import Axios from "axios";
import handleChapterCreate from "../../../api/handleChapterCreate";
import handleLessonUpdate from "../../../api/handleLessonV2update";
import { ApiError } from "../../../api/types";
import ChapterCreate from "../../../api/types/chapter/create";
import LessonUpdate from "../../../api/types/lesson-v2/update";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";

export default function newChapter(name: string, lesson?: string): void {
  const payload = {
    name,
  };
  Axios.post<ChapterCreate | ApiError>(`${API_URL}chapter/create`, payload)
    .then(handleChapterCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETCHAPTER",
        arg: { chapter: data, lesson },
      });
      if (lesson) {
        const updatedLesson = store.getState().createLessonV2.treeLessons[
          lesson
        ];
        Axios.put<LessonUpdate | ApiError>(`${API_URL}lesson`, {
          lesson_id: updatedLesson._id,
          chapters: updatedLesson.chapters,
        })
          .then(handleLessonUpdate)
          .catch(console.error);
      }
    })
    .catch(console.error);
}
