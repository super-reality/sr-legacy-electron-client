import React, { useCallback } from "react";
import Axios from "axios";
import { ReactComponent as EditButton } from "../../assets/svg/edit.svg";
import { ApiError, ApiJoin } from "../api/types";
import handleGenericGet from "../api/handleGenericGet";
import { API_URL } from "../constants";
import { ICollectionGet } from "../api/types/collection/get";
import { ISubjectGet } from "../api/types/subject/get";
import { ILessonGet } from "../api/types/lesson/get";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";

function triggerEditCollection(data: ICollectionGet) {
  reduxAction(store.dispatch, {
    type: "CREATE_COLLECTION_DATA",
    arg: {
      id: data._id,
      icon: data.icon,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      medias: data.medias,
      tags: data.tags,
      visibility: data.visibility,
      entry: data.entry,
    },
  });
  console.log("triggerEditCollection", data);
}

function triggerEditSubject(data: ISubjectGet) {
  console.log("triggerEditSubject", data);
}

function triggerEditLesson(data: ILessonGet) {
  console.log("triggerEditLesson", data);
}

type EditArg = ApiJoin & { id: string };

function fetchData<A>(arg: EditArg): Promise<A> {
  return new Promise((resolve, reject) => {
    Axios.get<NonNullable<typeof arg["api"]> | ApiError>(
      `${API_URL}${arg.type}/${arg.id}`
    )
      .then(handleGenericGet)
      .then((d: any) => resolve(d))
      .catch(reject);
  });
}

export default function useEditButton(arg: EditArg): () => JSX.Element {
  const callback = useCallback(() => {
    if (arg.type == "collection") {
      fetchData<NonNullable<typeof arg["api"]>>(arg).then((getData) => {
        triggerEditCollection(getData.collection);
      });
    }
    if (arg.type == "subject") {
      fetchData<NonNullable<typeof arg["api"]>>(arg).then((getData) => {
        triggerEditSubject(getData.subject);
      });
    }
    if (arg.type == "lesson") {
      fetchData<NonNullable<typeof arg["api"]>>(arg).then((getData) => {
        triggerEditLesson(getData.lesson);
      });
    }
  }, []);

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
