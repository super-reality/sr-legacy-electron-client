import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import SubjectCreate from "./types/subject/create";

export default function handleSubjectCreate(
  res: AxiosResponse<SubjectCreate | ApiError>
) {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        reduxAction(store.dispatch, {
          type: "CREATE_SUBJECT_RESET",
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
