import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import SubjectSearchParent from "./types/subject/search-parent";
import { Parents } from "./types/lesson/search-parent";
import apiErrorHandler from "./apiErrorHandler";

export default function handleSubjectSearchParent(
  res: AxiosResponse<SubjectSearchParent | ApiError>
): Promise<Parents[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<SubjectSearchParent>(res)
      .then((d) => resolve(d.parents))
      .catch(reject);
  });
}
