import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import SubjectGet from "./types/subject/get";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleSubjectGet(
  res: AxiosResponse<ApiError | SubjectGet>
): Promise<SubjectGet> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        resolve(res.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
