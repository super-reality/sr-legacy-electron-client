import React, { useCallback, useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DummyOne } from "../../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as DummyTwo } from "../../../../assets/svg/add-video.svg";
import { ReactComponent as ButtonPlay } from "../../../../assets/svg/play.svg";
import ButtonRound from "../../button-round";
import reduxAction from "../../../redux/reduxAction";
import idNamePos from "../../../../utils/idNamePos";
import store, { AppState } from "../../../redux/stores/renderer";

const sidebarIcons = [
  {
    title: "dummy one",
    icon: DummyOne,
    component: <>Dummy One</>,
  },
  {
    title: "dummy two",
    icon: DummyTwo,
    component: (
      <>{`Dummy Two Title! put a whole jsx component here, like "<Component>"`}</>
    ),
  },
];

export default function EditorSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(0);
  const { treeCurrentType } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const dispatch = useDispatch();

  const props = useSpring({
    width: expanded ? "300px" : "0px",
    minWidth: expanded ? "300px" : "0px",
  });

  const doPreviewCurrentToNumber = useCallback(() => {
    const slice = store.getState().createLessonV2;

    const lessonId = slice.currentLesson;
    const chapterId = slice.currentChapter;
    const stepId = slice.currentStep;

    if (lessonId && chapterId && stepId) {
      const lesson = slice.treeLessons[lessonId];
      const chapter = slice.treeChapters[chapterId];
      const chapterPos = lesson ? idNamePos(lesson.chapters, chapterId) : 0;
      const stepPos = chapter ? idNamePos(chapter.steps, stepId) : 0;

      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingChapterNumber: chapterPos > -1 ? chapterPos : 0,
          playingStepNumber: stepPos > -1 ? stepPos : 0,
        },
      });
    } else if (lessonId && chapterId) {
      const lesson = slice.treeLessons[lessonId];
      const chapterPos = lesson ? idNamePos(lesson.chapters, chapterId) : 0;

      reduxAction(dispatch, {
        type: "SET_LESSON_PLAYER_DATA",
        arg: {
          playingChapterNumber: chapterPos > -1 ? chapterPos : 0,
        },
      });
    }
  }, [dispatch]);

  /*
  const doPreviewOne = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: treeCurrentType == "lesson",
        chapterPreview: treeCurrentType == "chapter",
        stepPreview: treeCurrentType == "step",
        itemPreview: treeCurrentType == "item",
        anchorTestView: false,
        previewing: true,
        previewOne: true,
      },
    });
    doPreviewCurrentToNumber();
  }, [dispatch, treeCurrentType, doPreviewCurrentToNumber]);
  */

  const doPreview = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        lessonPreview: treeCurrentType == "lesson",
        chapterPreview: treeCurrentType == "chapter",
        stepPreview: treeCurrentType == "step",
        itemPreview: treeCurrentType == "item",
        anchorTestView: false,
        previewing: true,
        previewOne: false,
      },
    });
    doPreviewCurrentToNumber();
  }, [dispatch, treeCurrentType, doPreviewCurrentToNumber]);

  return (
    <>
      <animated.div style={props} className="sidebar-expanded">
        <div className="sidebar-content">
          {sidebarIcons[current]?.component}
        </div>
      </animated.div>
      <div className="sidebar-buttons">
        {sidebarIcons.map((icon, index) => {
          return (
            <ButtonRound
              onClick={() => {
                setCurrent(index);
                if (index == current || !expanded) setExpanded(!expanded);
              }}
              width="32px"
              height="32px"
              key={icon.title}
              svg={icon.icon}
              title={icon.title}
            />
          );
        })}
        <ButtonRound
          width="36px"
          height="36px"
          iconFill="var(--color-green)"
          onClick={doPreview}
          svg={ButtonPlay}
          style={{ marginRight: "8px" }}
        />
      </div>
    </>
  );
}
