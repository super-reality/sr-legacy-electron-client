import Axios from "axios";
import handleChapterCreate from "../../../api/handleChapterCreate";
import { ApiError } from "../../../api/types";
import ChapterCreate from "../../../api/types/chapter/create";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import updateLesson from "./updateLesson";

export default function newChapter(
  name: string,
  lesson?: string
): Promise<void> {
  const payload = {
    name,
  };
  return Axios.post<ChapterCreate | ApiError>(
    `${API_URL}chapter/create`,
    payload
  )
    .then(handleChapterCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETCHAPTER",
        arg: { chapter: data, lesson },
      });
      if (lesson) {
        updateLesson({}, lesson);
      }
    })
    .catch(console.error);
}
