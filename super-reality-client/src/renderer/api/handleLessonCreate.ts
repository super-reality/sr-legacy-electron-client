import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { LessonResp } from "./types/lesson/create";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import apiErrorHandler from "./apiErrorHandler";

/* eslint-disable camelcase */
export default function handleLessonCreate(
  res: AxiosResponse<LessonResp | ApiError>
): Promise<void> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<LessonResp>(res)
      .then((d) => {
        reduxAction(store.dispatch, {
          type: "CREATE_LESSON_RESET",
          arg: null,
        });
        resolve();
      })
      .catch(reject);
  });
}
