import React, { useCallback, useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DummyOne } from "../../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as DummyTwo } from "../../../../assets/svg/add-video.svg";
// import { ReactComponent as ButtonPlay } from "../../../../assets/svg/play.svg";
// import { ReactComponent as ButtonMic } from "../../../../assets/svg/mic.svg";
// import { ReactComponent as ButtonShareScreen } from "../../../../assets/svg/share-screen.svg";
// import { ReactComponent as ButtonGamepad } from "../../../../assets/svg/gamepad.svg";
// import { ReactComponent as ButtonVideocam } from "../../../../assets/svg/videocam.svg";
// import { ReactComponent as ButtonAirplay } from "../../../../assets/svg/airplay.svg";
// import { ReactComponent as ButtonPencil } from "../../../../assets/svg/pencil.svg";
// import { ReactComponent as ButtonSideBarAdd } from "../../../../assets/svg/sidebar-add.svg";

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
// import { ReactComponent as ButtonShare } from "../../../../assets/svg/share-new.svg";
// import SidebarLogo from "../../../../assets/images/sidebar-log.png";
// import SidebarLogoSvg from "../../../../assets/svg/sidebar-logo.svg";
import ButtonForward from "../../../../assets/images/forward-btn.png";
import ButtonBack from "../../../../assets/images/back-btn.png";
import ButtonRefresh from "../../../../assets/images/refresh-btn.png";
import ButtonEdit from "../../../../assets/images/edit-btn.png";
import ButtonTeacher from "../../../../assets/images/teacher.png";
import ButtonBrowser from "../../../../assets/images/browser.png";
import ButtonContent from "../../../../assets/images/content.png";
import ButtonShareNew from "../../../../assets/images/share-btn.png";
import ButtonAdd from "../../../../assets/images/add-btn.png";
import ButtonSonic from "../../../../assets/images/sonic-btn.png";
import ButtonDavinci from "../../../../assets/images/davinci-btn.png";
// import ControlButtons from "../../../../assets/images/control-icons.png";
// import { ReactComponent as GameGen } from "../../../../assets/svg/game-gen.svg";
import ButtonRound from "../../button-round";
import reduxAction from "../../../redux/reduxAction";
import idNamePos from "../../../../utils/idNamePos";
import store, { AppState } from "../../../redux/stores/renderer";
import Browser from "../../browser";
import { MODE_LESSON_CREATOR } from "../../../redux/slices/renderSlice";
import setAppMode from "../../../redux/utils/setAppMode";

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
    title: "Chat Channel",
    icon: ButtonMessages,
    component: <Browser />,
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

  const onClick = useCallback(() => {
    setAppMode(MODE_LESSON_CREATOR);
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div className="sidebar-buttons button-logo">
        <div className="sidebar-logo" />

        <div className="control-buttons">
          <div className="dropdown">
            <div className="button-forward">
              <button type="button">
                <img src={ButtonForward} />
              </button>
            </div>

            <div className="dropdown-content">
              <button type="button">
                <img src={ButtonRefresh} />
              </button>
              <button type="button">
                <img src={ButtonBack} />
              </button>
            </div>
          </div>
        </div>

        <div className="communication-buttons">
          <div className="group-buttons">
            <div className="sidebar-group">
              <div
                className="open-group"
                onClick={() => {
                  setCurrent(2);
                  setExpanded(!expanded);
                  setIsChat(!isChat);
                }}
              />
            </div>
          </div>
        </div>

        <div className="action-buttons button-edit">
          <div className="dropdown">
            <button type="button">
              <img src={ButtonEdit} />
            </button>

            <div className="dropdown-content">
              <button type="button">
                <img title="Content" src={ButtonContent} />
              </button>
              <button type="button" onClick={onClick}>
                <img title="Teacher" src={ButtonTeacher} />
              </button>
              <button type="button">
                <img title="Browser" src={ButtonBrowser} />
              </button>
            </div>
          </div>
        </div>

        <div className="action-buttons button-share">
          <div className="dropdown">
            <button type="button">
              <img src={ButtonShareNew} />
            </button>
            <div className="dropdown-content">
              <button type="button">
                <img title="Add" src={ButtonAdd} />
              </button>
              <button type="button">
                <img title="Sonic" src={ButtonSonic} />
              </button>
              <button type="button">
                <img title="Davinci" src={ButtonDavinci} />
              </button>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          {/* {sidebarIcons.map((icon, index) => {
            // Limit the loop to the action buttons on the array
            if (index < 2 || index > 8) return null;
            return (
              <ButtonRound
                onClick={() => {
                  setCurrent(index);
                  if (index == current || !expanded) setExpanded(!expanded);
                  if (index == current && icon.title == "Chat")
                    setIsChat(!isChat);
                }}
                width="32px"
                height="32px"
                key={icon.title}
                svg={icon.icon}
                title={icon.title}
              />
            );
          })} */}
          <div className="logged-user">
            <ButtonRound
              onClick={doPreview}
              width="44px"
              height="44px"
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
    </div>
  );
}
