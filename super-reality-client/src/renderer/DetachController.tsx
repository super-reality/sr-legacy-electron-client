import React from "react";
import "./App.scss";
import { useSelector } from "react-redux";
import { AppState } from "./redux/stores/renderer";
import ViewLesson from "./components/view-lesson";
import SnipingTool from "./components/sniping-tool";

export default function DetachController(): JSX.Element {
  const { detached } = useSelector((state: AppState) => state.commonProps);

  return (
    <>
      {detached?.type == "SNIPING_TOOL" && <SnipingTool />}
      {detached?.type == "LESSON_VIEW" && (
        <div className="content-deatched">
          <div className="content-wrapper">
            {detached?.type == "LESSON_VIEW" ? (
              <ViewLesson id={detached.arg._id} />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}
