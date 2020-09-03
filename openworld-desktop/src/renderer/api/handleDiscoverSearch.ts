import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonSearch from "./types/lesson/search";
import SubjectSearch from "./types/subject/search";
import CollectionSearch from "./types/collection/search";

export type AllSearchResults = LessonSearch | SubjectSearch | CollectionSearch;

export type SearchUrlNames = "lesson" | "subject" | "collection";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleDiscoverSearch(
  res: AxiosResponse<ApiError | AllSearchResults>,
  type: SearchUrlNames
): Promise<AllSearchResults> {
  return new Promise((resolve, reject) => {
    if (res.status == 200) {
      if (res.data.err_code == 0) {
        res.data.type = type;
        resolve(res.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
