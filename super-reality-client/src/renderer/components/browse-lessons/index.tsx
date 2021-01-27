import React from "react";
import "./index.scss";

import { useHistory } from "react-router-dom";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
import Windowlet from "../windowlet";
import LessonPreview from "./lesson-preview";
import ReactSelect from "../top-select";
import { voidFunction } from "../../constants";

const options = ["My Tutorials", "Shared with me", "Public"];

export default function BrowseLessons() {
  const history = useHistory();
  return (
    <Windowlet
      width={1100}
      height={600}
      title="Super Reality"
      onMinimize={minimizeWindow}
      onClose={() => history.push("/")}
    >
      <div className="browse-lessons-window">
        <div className="controls">
          <div>Tutorials</div>
          <ReactSelect
            style={{ width: "160px", marginLeft: "32px" }}
            current={options[0]}
            options={options}
            callback={voidFunction}
          />
        </div>
        <div className="grid">
          <LessonPreview title="How to make Pong" />
          <LessonPreview title="This is a dummy" />
          <LessonPreview title="Another dummy" />
          <LessonPreview title="Learn how to make CS:GO" />
          <LessonPreview title="Make fun stuff" />
        </div>
      </div>
    </Windowlet>
  );
}
