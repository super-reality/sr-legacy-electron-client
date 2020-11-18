import { AxiosResponse } from "axios";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IChapter } from "./types/chapter/chapter";
import ChapterUpdate from "./types/chapter/update";

/* eslint-disable camelcase */
export default function handleChapterUpdate(
  res: AxiosResponse<ChapterUpdate | ApiError>
): Promise<IChapter> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ChapterUpdate>(res)
      .then((d) => {
        reduxAction(store.dispatch, {
          type: "CREATE_LESSON_V2_SETCHAPTER",
          arg: { chapter: d.chapter },
        });
        resolve(d.chapter);
      })
      .catch(reject);
  });
}
