import Axios from "axios";
import handleChapterGet from "../../../api/handleChapterGet";
import { ApiError } from "../../../api/types";
import { IChapter } from "../../../api/types/chapter/chapter";
import { ChapterGet } from "../../../api/types/chapter/get";
import { API_URL } from "../../../constants";

export default function getChapter(id: string): Promise<IChapter> {
  return new Promise((resolve, reject) => {
    Axios.get<ChapterGet | ApiError>(`${API_URL}chapter/${id}`)
      .then(handleChapterGet)
      .then(resolve)
      .catch(reject);
  });
}
