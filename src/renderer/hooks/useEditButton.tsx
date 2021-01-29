import React, { useCallback } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { ReactComponent as EditButton } from "../../assets/svg/edit.svg";
import { ApiError, ApiJoin } from "../api/types";
import handleGenericGet from "../api/handleGenericRequest";
import { API_URL } from "../constants";
import { ICollectionGet } from "../api/types/collection/get";
import { ISubjectGet } from "../api/types/subject/get";
import { ILessonGet } from "../api/types/lesson/get";
import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/renderer";
import Category from "../../types/collections";
import stringToITag from "../../utils/stringToITag";

function triggerEditCollection(data: ICollectionGet) {
  reduxAction(store.dispatch, {
    type: "CREATE_COLLECTION_DATA",
    arg: {
      _id: data._id,
      icon: data.icon,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      medias: data.medias,
      tags: stringToITag(data.tags),
      visibility: data.visibility,
      entry: data.entry,
    },
  });
}

function triggerEditSubject(data: ISubjectGet) {
  reduxAction(store.dispatch, {
    type: "CREATE_SUBJECT_DATA",
    arg: {
      _id: data._id,
      icon: data.icon,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      medias: data.medias,
      tags: stringToITag(data.tags),
      visibility: data.visibility,
      entry: data.entry,
    },
  });
}

function triggerEditLesson(data: ILessonGet) {
  reduxAction(store.dispatch, {
    type: "CREATE_LESSON_DATA",
    arg: {
      _id: data._id,
      icon: data.icon,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      difficulty: data.difficulty,
      medias: data.medias,
      tags: stringToITag(data.tags),
      visibility: data.visibility,
      ownership: data.ownership,
      entry: data.entry,
      steps: data.totalSteps,
    },
  });
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
  const history = useHistory();

  const callback = useCallback(() => {
    if (arg.type == "collection") {
      fetchData<NonNullable<typeof arg["api"]>>(arg).then((getData) => {
        triggerEditCollection(getData.collection);
      });
      history.push(`/create/${Category.Collection}`);
    }
    if (arg.type == "subject") {
      fetchData<NonNullable<typeof arg["api"]>>(arg).then((getData) => {
        triggerEditSubject(getData.subject);
      });
      history.push(`/create/${Category.Subject}`);
    }
    if (arg.type == "lesson") {
      fetchData<NonNullable<typeof arg["api"]>>(arg).then((getData) => {
        triggerEditLesson(getData.lesson);
      });
      history.push(`/create/${Category.Lesson}`);
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
