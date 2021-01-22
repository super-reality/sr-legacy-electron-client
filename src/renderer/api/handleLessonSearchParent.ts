import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import LessonSearchParent, { Parents } from "./types/lesson/search-parent";

export default function handleLessonSearchParent(
  res: AxiosResponse<LessonSearchParent | ApiError>
): Promise<Parents[]> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<LessonSearchParent>(res)
      .then((d) => resolve(d.parents))
      .catch(reject);
  });
}
