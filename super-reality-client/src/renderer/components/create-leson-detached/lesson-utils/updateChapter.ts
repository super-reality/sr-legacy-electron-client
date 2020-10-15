import Axios from "axios";
import _ from "lodash";
import handleChapterUpdate from "../../../api/handleChapterUpdate";
import { ApiError } from "../../../api/types";
import { IChapter } from "../../../api/types/chapter/chapter";
import ChapterUpdate from "../../../api/types/chapter/update";
import { API_URL } from "../../../constants";
import store from "../../../redux/stores/renderer";

export default function updateChapter(
  data: Partial<IChapter>,
  id: string
): void {
  const updated = store.getState().createLessonV2.treeChapters[id];
  const newData = {
    steps: updated.steps,
    ...data,
    chapter_id: id,
  };

  Axios.put<ChapterUpdate | ApiError>(
    `${API_URL}chapter`,
    _.omit(newData, ["_id", "__v", "createdBy", "createdAt", "updatedAt"])
  )
    .then(handleChapterUpdate)
    .catch(console.error);
}
