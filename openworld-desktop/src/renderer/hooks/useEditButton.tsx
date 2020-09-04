import React, { useCallback } from "react";
import Axios from "axios";
import { ReactComponent as EditButton } from "../../assets/svg/edit.svg";
import CollectionGet, { ICollectionGet } from "../api/types/collection/get";
import useDataGet from "./useDataGet";
import { ApiSucess, ApiError } from "../api/types";
import handleGenericGet from "../api/handleGenericGet";
import { API_URL } from "../constants";
import SubjectGet, { ISubjectGet } from "../api/types/subject/get";
import LessonGet, { ILessonGet } from "../api/types/lesson/get";

function triggerEditCollection(data: ICollectionGet) {
  console.log("triggerEditCollection", data);
}

interface CollectionArg {
  type: "collection";
  id?: string;
  data?: ICollectionGet;
  api?: CollectionGet;
}

interface SubjectArg {
  type: "subject";
  id?: string;
  data?: ISubjectGet;
  api?: SubjectGet;
}

interface LessonArg {
  type: "lesson";
  id?: string;
  data?: ILessonGet;
  api?: LessonGet;
}

type EditArg = CollectionArg | SubjectArg | LessonArg;

function fetchData<T>(arg: EditArg): Promise<T> {
  return new Promise((resolve, reject) => {
    Axios.get<NonNullable<typeof arg["api"]> | ApiError>(
      `${API_URL}${arg.type}/${arg.id}`
    )
      .then((d) => handleGenericGet<NonNullable<typeof arg["api"]>>(d))
      .then((d) => {
        if (d && arg.type == "collection") {
          resolve(d.collection);
        }
        if (d && arg.type == "subject") {
          resolve(d.subject);
        }
        if (d && arg.type == "lesson") {
          resolve(d.lesson);
        }
      })
      .catch(reject);
  });
}

export default function useEditButton(arg: EditArg): () => JSX.Element {
  const [data] = useDataGet<ApiSucess, typeof arg["data"]>(
    arg.type,
    arg.id || ""
  );

  const callback = useCallback(() => {
    fetchData<typeof arg["data"]>(arg).then((getData) => {
      if (arg.type == "collection" && getData) {
        triggerEditCollection(getData);
      }
    });
  }, [data]);

  const Component = () => (
    <div
      className="icon-button"
      style={{
        margin: "auto",
        display: "flex",
      }}
      onClick={(e) => {
        e.stopPropagation();
        callback();
      }}
    >
      <EditButton
        width="20px"
        height="20px"
        fill="var(--color-icon)"
        style={{ margin: "auto" }}
      />
    </div>
  );

  return Component;
}
