import React, { useRef, useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactComponent as DummyOne } from "../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as DummyTwo } from "../../../assets/svg/add-video.svg";
import { ReactComponent as ButtonMessages } from "../../../assets/svg/messages.svg";
import { ReactComponent as DefaultUser } from "../../../assets/svg/default-user.svg";
import ButtonForward from "../../../assets/images/forward-btn.png";
import ButtonBack from "../../../assets/images/back-btn.png";
import ButtonRefresh from "../../../assets/images/refresh-btn.png";
import ButtonEdit from "../../../assets/images/edit-btn.png";
import ButtonTeacher from "../../../assets/images/teacher.png";
import ButtonBrowser from "../../../assets/images/browser.png";
import ButtonContent from "../../../assets/images/content.png";

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
    componentWidth: 400,
  },
  {
    title: "dummy two",
    icon: DummyTwo,
    component: (
      <>{`Dummy Two Title! put a whole jsx component here, like "<Component>"`}</>
    ),
    componentWidth: 400,
  },
  {
    title: "Chat Channel",
    icon: ButtonMessages,
    component: <Browser />,
    componentWidth: 700,
  },
];

export default function Sidebar() {
  const [wideView, _setWideView] = useState(false);
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

  const mainProps = useSpring({
    width: wideView ? `200px` : "64px",
    minWidth: wideView ? `200px` : "64px",
  } as any);

  const props = useSpring({
    width: expanded ? `${sidebarIcons[current]?.componentWidth}px` : "0px",
    minWidth: expanded ? `${sidebarIcons[current]?.componentWidth}px` : "0px",
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
        style={{ right: "0px", top: "60px", ...mainProps }}
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

          <div className="action-buttons">
            {sidebarIcons.map((icon, index) => {
              return (
                <ButtonRound
                  onClick={() => {
                    setCurrent(index);
                    setExpanded(current == index ? !expanded : true);
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
