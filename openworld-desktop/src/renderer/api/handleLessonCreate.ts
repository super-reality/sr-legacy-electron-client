import { AxiosResponse } from "axios";
import { remote } from "electron";
import { ApiError } from "./types";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import LessonCreate, { LessonResp } from "./types/lesson/create";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleLessonCreate(res: ApiError | LessonResp) {
  if (res.err_code == 0) {
    const lessonID: string = res.lesson._id;

    reduxAction(store.dispatch, { type: "CREATE_LESSON_RESET", arg: null });
  }
}
