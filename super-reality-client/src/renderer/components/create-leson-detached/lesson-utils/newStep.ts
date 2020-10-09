import Axios from "axios";
import handleChapterUpdate from "../../../api/handleChapterUpdate";
import handleStepCreate from "../../../api/handleStepCreate";
import { ApiError } from "../../../api/types";
import ChapterUpdate from "../../../api/types/chapter/update";
import StepCreate from "../../../api/types/step/create";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";

export default function newStep(name: string, chapter?: string): void {
  const payload = {
    name,
  };
  Axios.post<StepCreate | ApiError>(`${API_URL}step/create`, payload)
    .then(handleStepCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETSTEP",
        arg: { step: data, chapter },
      });
      if (chapter) {
        const updatedChapter = store.getState().createLessonV2.treeChapters[
          chapter
        ];
        Axios.put<ChapterUpdate | ApiError>(`${API_URL}chapter`, {
          chapter_id: updatedChapter._id,
          steps: updatedChapter.steps,
        })
          .then(handleChapterUpdate)
          .catch(console.error);
      }
    })
    .catch(console.error);
}
