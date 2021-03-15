import React, { useEffect } from "react";
import "./index.scss";

import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
import Windowlet from "../windowlet";
import LessonPreview, { LessonPreviewAdd } from "./lesson-preview";
import ReactSelect from "../top-select";
import { voidFunction } from "../../constants";
import { AppState } from "../../redux/stores/renderer";
import getLesson from "../create-leson-detached/lesson-utils/getLesson";
import reduxAction from "../../redux/reduxAction";
import newLesson from "../create-leson-detached/lesson-utils/newLesson";

const options = ["My Tutorials", "Shared with me", "Public"];

export default function BrowseLessons() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { lessons } = useSelector((state: AppState) => state.userData);

  useEffect(() => {
    lessons.forEach((id) => {
      getLesson(id)
        .then((data) => {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETLESSON",
            arg: data,
          });
        })
        .catch(console.error);
    });
  }, [dispatch, lessons]);

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
          {lessons.map((id) => {
            return <LessonPreview key={`lesson-preview-${id}`} id={id} />;
          })}
          <LessonPreviewAdd
            onClick={() => {
              newLesson({ name: "New Lesson" }).then((lesson) => {
                if (lesson) {
                  console.log(lesson);
                  reduxAction(dispatch, {
                    type: "USERDATA_SET_LESSONS",
                    arg: [...lessons, lesson._id],
                  });
                }
              });
            }}
          />
        </div>
      </div>
    </Windowlet>
  );
}
