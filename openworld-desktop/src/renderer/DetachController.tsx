/* eslint-disable no-underscore-dangle */
import React from "react";
import "./App.scss";
import { useSelector } from "react-redux";
import { AppState } from "./redux/stores/renderer";
import LessonActive from "./components/lesson-active";

export default function DetachController(): JSX.Element {
  const { detached } = useSelector((state: AppState) => state.commonProps);

  return (
    <div className="content-deatched">
      <div className="content-wrapper">
        {detached?.type == "LESSON_VIEW" ? (
          <LessonActive id={detached.arg._id} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
