import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import SubjectCreate from "./types/subject/create";

export default function handleSubjectCreate(
  res: AxiosResponse<SubjectCreate | ApiError>
) {
  if (res.status === 200) {
    reduxAction(store.dispatch, { type: "CREATE_SUBJECT_RESET", arg: null });
  }
}
