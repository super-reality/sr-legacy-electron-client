import React, { useRef, useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as DummyOne } from "../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as DummyTwo } from "../../../assets/svg/add-video.svg";
// import { ReactComponent as ButtonPlay } from "../../../assets/svg/play.svg";
// import { ReactComponent as ButtonMic } from "../../../assets/svg/mic.svg";
// import { ReactComponent as ButtonShareScreen } from "../../../assets/svg/share-screen.svg";
// import { ReactComponent as ButtonGamepad } from "../../../assets/svg/gamepad.svg";
// import { ReactComponent as ButtonVideocam } from "../../../assets/svg/videocam.svg";
// import { ReactComponent as ButtonAirplay } from "../../../assets/svg/airplay.svg";
// import { ReactComponent as ButtonPencil } from "../../../assets/svg/pencil.svg";
// import { ReactComponent as ButtonSideBarAdd } from "../../../assets/svg/sidebar-add.svg";

// import { ReactComponent as ButtonScreenShare } from "../../../assets/svg/screenshare.svg";
// import { ReactComponent as ButtonPeople } from "../../../assets/svg/people.svg";
// import { ReactComponent as ButtonRecentPeople } from "../../../assets/svg/recent-actors.svg";
import { ReactComponent as ButtonMessages } from "../../../assets/svg/messages.svg";
// import { ReactComponent as ButtonNotification } from "../../../assets/svg/notification.svg";
// import { ReactComponent as ButtonError } from "../../../assets/svg/error.svg";
// import { ReactComponent as ButtonTick } from "../../../assets/svg/tickmark.svg";
// import { ReactComponent as ButtonRefresh } from "../../../assets/svg/refresh.svg";
// import { ReactComponent as ButtonPlayNew } from "../../../assets/svg/play-new.svg";
import { ReactComponent as DefaultUser } from "../../../assets/svg/default-user.svg";
// import { ReactComponent as ButtonShare } from "../../../assets/svg/share-new.svg";
// import SidebarLogo from "../../../assets/images/sidebar-log.png";
// import SidebarLogoSvg from "../../../assets/svg/sidebar-logo.svg";
import ButtonForward from "../../../assets/images/forward-btn.png";
import ButtonBack from "../../../assets/images/back-btn.png";
import ButtonRefresh from "../../../assets/images/refresh-btn.png";
import ButtonEdit from "../../../assets/images/edit-btn.png";
import ButtonTeacher from "../../../assets/images/teacher.png";
import ButtonBrowser from "../../../assets/images/browser.png";
import ButtonContent from "../../../assets/images/content.png";
import ButtonShareNew from "../../../assets/images/share-btn.png";
import ButtonAdd from "../../../assets/images/add-btn.png";
import ButtonSonic from "../../../assets/images/sonic-btn.png";
import ButtonDavinci from "../../../assets/images/davinci-btn.png";
// import ControlButtons from "../../../assets/images/control-icons.png";
// import { ReactComponent as GameGen } from "../../../assets/svg/game-gen.svg";
import ButtonRound from "../button-round";
import Browser from "../browser";
import { voidFunction } from "../../constants";
import SidebarControls from "./sidebar-controls";
import useLessonPlayer from "../lesson-player/useLessonPlayer";
import { AppState } from "../../redux/stores/renderer";

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

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(0);
  const history = useHistory();

  const {
    lessonPreview,
    chapterPreview,
    stepPreview,
    itemPreview,
    currentLesson,
  } = useSelector((state: AppState) => state.createLessonV2);

  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  let width = "300px";

  // chat button
  if (current == 2) {
    width = "700px";
  }
  // support button
  if (current == 3) {
    width = "720px";
  }
  // solution button
  if (current == 4) {
    width = "820px";
  }

  const props = useSpring({
    width: expanded ? width : "0px", // "550px"
    minWidth: expanded ? width : "0px",
  });

  const [Reality, doPrev, doNext, _doPlay, doClear] = useLessonPlayer(
    currentLesson || ""
  );

  return (
    <>
      {(lessonPreview || chapterPreview || stepPreview || itemPreview) &&
        currentLesson &&
        Reality}
      <div
        style={{ right: "0px", top: "60px" }}
        ref={sidebarContainerRef}
        className="sidebar-container"
      >
        <div className="sidebar-buttons button-logo">
          <SidebarControls sidebarRef={sidebarContainerRef} />

          <div className="control-buttons">
            <div className="dropdown">
              <div className="button-forward">
                <button type="button" onClick={doNext}>
                  <img src={ButtonForward} />
                </button>
              </div>

              <div className="dropdown-content">
                <button type="button" onClick={doClear}>
                  <img src={ButtonRefresh} />
                </button>
                <button type="button" onClick={doPrev}>
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
                <button
                  type="button"
                  onClick={() => history.push("/lesson/create")}
                >
                  <img title="Content" src={ButtonContent} />
                </button>
                <button
                  type="button"
                  onClick={() => history.push("/lesson/create")}
                >
                  <img title="Teacher" src={ButtonTeacher} />
                </button>
                <button
                  type="button"
                  onClick={() => history.push("/lesson/view")}
                >
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
                onClick={voidFunction}
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
    </>
  );
}
