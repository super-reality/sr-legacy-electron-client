import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { LessonResp } from "./types/lesson/create";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleLessonCreate(
  res: AxiosResponse<ApiError | LessonResp>
): Promise<void> {
  reduxAction(store.dispatch, { type: "SET_LOADING_STATE", arg: false });
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        reduxAction(store.dispatch, {
          type: "CREATE_COLLECTION_RESET",
          arg: null,
        });
        resolve();
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
