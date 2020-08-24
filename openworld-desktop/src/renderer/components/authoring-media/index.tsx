import React from "react";
import "../containers.scss";
import "../create-lesson/index.scss";
import { useDispatch, useSelector } from "react-redux";
import BaseInsertMedia from "../base-insert-media";
import { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";

export default function MediaAuthoring(): JSX.Element {
  const dispatch = useDispatch();
  const { medias } = useSelector((state: AppState) => state.createLesson);

  const insertUrl = (image: string, index: number) => {
    console.log(image, index);
    console.log(medias);
    const arr: string[] = [...medias];
    arr.splice(index, 1, image);

    reduxAction(dispatch, {
      type: "CREATE_LESSON_DATA",
      arg: { medias: arr },
    });
  };

  return (
    <BaseInsertMedia
      style={{ gridArea: "media" }}
      title="Add Media"
      urls={medias}
      callback={insertUrl}
    />
  );
}
