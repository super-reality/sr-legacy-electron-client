import React, { useCallback, useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DummyOne } from "../../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as DummyTwo } from "../../../../assets/svg/add-video.svg";
// import { ReactComponent as ButtonPlay } from "../../../../assets/svg/play.svg";
import { ReactComponent as ButtonMic } from "../../../../assets/svg/mic.svg";
import { ReactComponent as ButtonGamepad } from "../../../../assets/svg/gamepad.svg";
import { ReactComponent as ButtonVideocam } from "../../../../assets/svg/videocam.svg";
import { ReactComponent as ButtonAirplay } from "../../../../assets/svg/airplay.svg";
import { ReactComponent as ButtonEye } from "../../../../assets/svg/eye.svg";
import { ReactComponent as ButtonScreenShare } from "../../../../assets/svg/screenshare.svg";
import { ReactComponent as ButtonPeople } from "../../../../assets/svg/people.svg";
import { ReactComponent as ButtonRecentPeople } from "../../../../assets/svg/recent-actors.svg";
import { ReactComponent as ButtonMessages } from "../../../../assets/svg/messages.svg";
import { ReactComponent as ButtonNotification } from "../../../../assets/svg/notification.svg";
import { ReactComponent as ButtonError } from "../../../../assets/svg/error.svg";
import { ReactComponent as ButtonTick } from "../../../../assets/svg/tickmark.svg";
import { ReactComponent as ButtonRefresh } from "../../../../assets/svg/refresh.svg";
import { ReactComponent as ButtonPlayNew } from "../../../../assets/svg/play-new.svg";
import ButtonRound from "../../button-round";
import reduxAction from "../../../redux/reduxAction";
import idNamePos from "../../../../utils/idNamePos";
import store, { AppState } from "../../../redux/stores/renderer";
import ChatApplication from "../../chat";

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
  {
    title: "Microphone",
    icon: ButtonMic,
    component: <> Dummy Mic </>,
  },
  {
    title: "Gamepad",
    icon: ButtonGamepad,
    component: <b>Dum dum</b>,
  },
  {
    title: "Videocam",
    icon: ButtonVideocam,
    component: <>camera</>,
  },
  {
    title: "Airplay",
    icon: ButtonAirplay,
    component: <>AirPlay</>,
  },
  {
    title: "ButtonEye",
    icon: ButtonEye,
    component: <>Dummy Seven</>,
  },
  {
    title: "Chat",
    icon: ButtonMessages,
    component: <ChatApplication />,
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
    width: expanded ? "550px" : "0px",
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
        <div className="action-buttons">
          {sidebarIcons.map((icon, index) => {
            // Limit the loop to the action buttons on the array
            if (index < 2 || index > 7) return null;
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
        </div>
        <div className="communication-buttons">
          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonRecentPeople}
          />
          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonScreenShare}
          />
          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonPeople}
          />

          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonNotification}
          />
          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonError}
          />
          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonTick}
          />
        </div>

        <div className="control-buttons">
          <ButtonRound
            width="36px"
            height="36px"
            onClick={doPreview}
            svg={ButtonRefresh}
          />
          <ButtonRound
            width="36px"
            height="36px"
            onClick={doPreview}
            svg={ButtonPlayNew}
          />
        </div>
      </div>
    </>
  );
}

/*

          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonEye}
          />
          <ButtonRound
            onClick={doPreview}
            width="36px"
            height="36px"
            svg={ButtonMessages}
          />
*/
