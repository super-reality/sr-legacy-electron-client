import { AxiosResponse } from "axios";
import { remote } from "electron";
import { ApiError } from "./types";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import LessonCreate from "./types/lesson/create";

export default function handleLessonCreate(
  res: AxiosResponse<LessonCreate | ApiError>
) {
  if (res.status === 200) {
    remote.dialog.showMessageBox({
      title: "Alert",
      message: "Lesson Creation succeed.",
    });
    reduxAction(store.dispatch, { type: "CREATE_LESSON_RESET", arg: null });
  }
}
