import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import LessonSearch from "./types/lesson/search";
import SubjectSearch from "./types/subject/search";
import CollectionSearch from "./types/collection/search";
import apiErrorHandler from "./apiErrorHandler";

export type AllSearchResults = LessonSearch | SubjectSearch | CollectionSearch;

export type SearchUrlNames = "lesson" | "subject" | "collection";

/* eslint-disable camelcase */
export default function handleDiscoverSearch(
  res: AxiosResponse<AllSearchResults | ApiError>,
  type: SearchUrlNames
): Promise<AllSearchResults> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<AllSearchResults>(res)
      .then((d) => resolve(d))
      .catch(reject);
  });
}
