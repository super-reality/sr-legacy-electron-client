import { useState, useEffect } from "react";

import Axios from "axios";
import handleGenericGet from "../api/handleGenericGet";
import { API_URL } from "../constants";
import { ApiError, ApiSucess } from "../api/types";
import SubjectGet from "../api/types/subject/get";
import CollectionGet from "../api/types/collection/get";
import globalData from "../globalData";
import LessonGet from "../api/types/lesson/get";

export default function useDataGet<
  ApiGet extends ApiSucess,
  DataGet,
  ChildrenGet = any
>(
  type: "lesson" | "collection" | "subject",
  id: string
): [DataGet | undefined, ChildrenGet[] | null] {
  const gd: any = globalData;
  const [data, setData] = useState<DataGet | undefined>(
    gd[`${type}s`][id] || undefined
  );
  const [children, setChildren] = useState<ChildrenGet[]>([]);

  useEffect(() => {
    Axios.get<ApiGet | ApiError>(`${API_URL}${type}/${id}`)
      .then((d) => handleGenericGet<ApiGet>(d))
      .then((d: unknown) => {
        if (type == "collection") {
          const ret = d as CollectionGet;
          globalData.collections[id] = ret.collection;
          setData((d as any).collection);
          setChildren((d as any).subjects);
        }
        if (type == "subject") {
          const ret = d as SubjectGet;
          globalData.subjects[id] = ret.subject;
          setData((d as any).subject);
          setChildren((d as any).lessons);
        }
        if (type == "lesson") {
          const ret = d as LessonGet;
          globalData.lessons[id] = ret.lesson;
          setData((d as any).lesson);
        }
      })
      .catch(console.error);
  }, []);

  return [data, children.length > 0 ? children : null];
}
