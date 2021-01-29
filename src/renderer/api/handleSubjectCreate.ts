import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import SubjectCreate from "./types/subject/create";
import apiErrorHandler from "./apiErrorHandler";

export default function handleSubjectCreate(
  res: AxiosResponse<SubjectCreate | ApiError>
) {
  return new Promise((resolve, reject) => {
    apiErrorHandler<SubjectCreate>(res)
      .then((d) => {
        reduxAction(store.dispatch, {
          type: "CREATE_SUBJECT_RESET",
          arg: null,
        });
        resolve(d.data);
      })
      .catch(reject);
  });
}
