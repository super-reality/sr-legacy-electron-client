import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import SubjectGet from "./types/subject/get";

/* eslint-disable camelcase */
export default function handleSubjectGet(
  res: AxiosResponse<SubjectGet | ApiError>
): Promise<SubjectGet> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<SubjectGet>(res)
      .then((d) => resolve(d))
      .catch(reject);
  });
}
