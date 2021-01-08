import React, { useCallback, useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DummyOne } from "../../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as DummyTwo } from "../../../../assets/svg/add-video.svg";
// import { ReactComponent as ButtonPlay } from "../../../../assets/svg/play.svg";
import { ReactComponent as ButtonMic } from "../../../../assets/svg/mic.svg";
import { ReactComponent as ButtonShareScreen } from "../../../../assets/svg/share-screen.svg";
import { ReactComponent as ButtonGamepad } from "../../../../assets/svg/gamepad.svg";
import { ReactComponent as ButtonVideocam } from "../../../../assets/svg/videocam.svg";
// import { ReactComponent as ButtonAirplay } from "../../../../assets/svg/airplay.svg";
import { ReactComponent as ButtonPencil } from "../../../../assets/svg/pencil.svg";
import { ReactComponent as ButtonSideBarAdd } from "../../../../assets/svg/sidebar-add.svg";

// import { ReactComponent as ButtonScreenShare } from "../../../../assets/svg/screenshare.svg";
// import { ReactComponent as ButtonPeople } from "../../../../assets/svg/people.svg";
// import { ReactComponent as ButtonRecentPeople } from "../../../../assets/svg/recent-actors.svg";
import { ReactComponent as ButtonMessages } from "../../../../assets/svg/messages.svg";
// import { ReactComponent as ButtonNotification } from "../../../../assets/svg/notification.svg";
// import { ReactComponent as ButtonError } from "../../../../assets/svg/error.svg";
// import { ReactComponent as ButtonTick } from "../../../../assets/svg/tickmark.svg";
// import { ReactComponent as ButtonRefresh } from "../../../../assets/svg/refresh.svg";
// import { ReactComponent as ButtonPlayNew } from "../../../../assets/svg/play-new.svg";
import { ReactComponent as DefaultUser } from "../../../../assets/svg/default-user.svg";
import SidebarLogo from "../../../../assets/images/sidebar-log.png";
import ControlButtons from "../../../../assets/images/control-icons.png";
// import { ReactComponent as GameGen } from "../../../../assets/svg/game-gen.svg";
import ButtonRound from "../../button-round";
import reduxAction from "../../../redux/reduxAction";
import idNamePos from "../../../../utils/idNamePos";
import store, { AppState } from "../../../redux/stores/renderer";
import ChatApplication from "../../chat";
import Screenshare from "../../screenshare";
import Cams from "../../cams";
// import { ReactComponent as ButtonEye } from "../../../../assets/svg/eye.svg";
// import Channels from "../../channels";

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
    title: "Chat",
    icon: ButtonMessages,
    component: <ChatApplication />,
  },
  {
    title: "Pencil",
    icon: ButtonPencil,
    component: <b>Pencil</b>,
  },
  {
    title: "Gamepad",
    icon: ButtonGamepad,
    component: <b>Dum dum</b>,
  },
  {
    title: "Sharescreen",
    icon: ButtonShareScreen,
    component: <Screenshare />,
  },
  {
    title: "Videocam",
    icon: ButtonVideocam,
    component: <Cams />,
  },
  {
    title: "Microphone",
    icon: ButtonMic,
    component: <> Dummy Mic </>,
  },
];

export default function EditorSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [isChat, setIsChat] = useState(false);
  const [current, setCurrent] = useState(0);
  const { treeCurrentType } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const dispatch = useDispatch();

  let width = "300px";

  // chat button width
  if (current == 2) {
    width = "700px";
  }

  if (current == 6) {
    width = "250px";
  }

  const props = useSpring({
    width: expanded && isChat ? width : "0px", // "550px"
    minWidth: expanded ? width : "0px",
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
      <div className="sidebar-buttons">
        <div className="sidebar-logo">
          <img src={SidebarLogo} />
        </div>
        <div className="control-buttons">
          <img src={ControlButtons} alt="" />
        </div>
        <div className="communication-buttons">
          {/* <ButtonRound
            onClick={doPreview}
            width="40px"
            height="40px"
            svg={ButtonRecentPeople}
          />
          <ButtonRound
            onClick={doPreview}
            width="40px"
            height="40px"
            svg={ButtonScreenShare}
          />
          <ButtonRound
            onClick={doPreview}
            width="40px"
            height="40px"
            svg={ButtonError}
          /> */}

          <div className="groups">
            <div className="sidebar-group">
              <div className="open-group" />
            </div>
            <div className="sidebar-group">
              <div className="open-group" />
            </div>
            <div className="sidebar-group">
              <div className="open-group" />
            </div>
            <div className="sidebar-group">
              <div className="closed-group">
                <div className="small-group-icon" />
                <div className="small-group-icon" />
                <div className="small-group-icon" />
                <div className="small-group-icon" />
              </div>
            </div>
          </div>

          <ButtonRound
            onClick={doPreview}
            width="40px"
            height="40px"
            svg={ButtonSideBarAdd}
          />
        </div>

        <div className="action-buttons">
          {sidebarIcons.map((icon, index) => {
            // Limit the loop to the action buttons on the array
            if (index < 2 || index > 7) return null;
            return (
              <ButtonRound
                onClick={() => {
                  setCurrent(index);
                  if (index == current || !expanded) setExpanded(!expanded);
                  if (index == current && icon.title == "Chat") {
                    console.log("isChat", isChat);
                    setIsChat(!isChat);
                  }
                }}
                width="32px"
                height="32px"
                key={icon.title}
                svg={icon.icon}
                title={icon.title}
              />
            );
          })}
          <div className="logged-user">
            <ButtonRound
              onClick={doPreview}
              width="40px"
              height="40px"
              svg={DefaultUser}
            />
          </div>
        </div>
      </div>
      <animated.div style={props} className="sidebar-expanded">
        <div className="sidebar-content">
          {sidebarIcons[current]?.component}
        </div>
      </animated.div>
    </>
  );
}

/*
  {
    title: "ButtonEye",
    icon: ButtonEye,
    component: <Channels />,
  },
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
