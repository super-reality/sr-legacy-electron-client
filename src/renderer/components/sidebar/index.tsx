import React, { useCallback, useMemo, useRef, useState } from "react";
import "./index.scss";
import "../buttons.scss";

import { animated, useSpring, useTrail } from "react-spring";

import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { ReactComponent as GroupsIcon } from "../../../assets/svg/groups.svg";
import { ReactComponent as TutorialsIcon } from "../../../assets/svg/add-teach.svg";
import { ReactComponent as SupportIcon } from "../../../assets/svg/support-icon.svg";
import { ReactComponent as SupportListIcon } from "../../../assets/svg/support-list.svg";

import { ReactComponent as DefaultUser } from "../../../assets/svg/default-user.svg";
import { ReactComponent as LeftArrowIcon } from "../../../assets/svg/left-arrow.svg";
import { ReactComponent as RightArrowIcon } from "../../../assets/svg/right-arrow.svg";
import { ReactComponent as StopIcon } from "../../../assets/svg/stop.svg";

import ButtonRound from "../button-round";
import Browser from "../browser";
import { voidFunction } from "../../constants";
import SidebarControls from "./sidebar-controls";
import useLessonPlayer from "../lesson-player/useLessonPlayer";
import { AppState } from "../../redux/stores/renderer";
import GroupsList from "./groups-list";
import ActionButtons from "./action-buttons";
import Support from "../support";
import SupportTickets from "../support/support-tickets";
import ShootingStar from "../animations";

export interface SidebarIcon {
  title: string;
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  component: JSX.Element | any | null;
  subComponent: JSX.Element | any | null;
  componentWidth: number;
  onClick?: () => void;
}

export default function Sidebar() {
  const [wideView, setWideView] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [currentSub, setCurrentSub] = useState<string | undefined>(undefined);
  const history = useHistory();

  const {
    lessonPreview,
    chapterPreview,
    stepPreview,
    itemPreview,
    currentLesson,
  } = useSelector((state: AppState) => state.createLessonV2);
  const { loginData, groups, categories, channels } = useSelector(
    (state: AppState) => state.chat
  );

  const { playing } = useSelector((state: AppState) => state.lessonPlayer);

  const { width } = useSelector((state: AppState) => state.sidebar);

  const { user } = loginData;
  // console.log(groups);
  // Here we add more buttons to the sidebar!
  // See GroupsList for how to create a list of items for a button.
  // DO NOT add icons manually to the sidebar, only here.
  const sidebarIcons: SidebarIcon[] = useMemo(
    () => [
      {
        title: "Groups",
        icon: GroupsIcon,
        component: <Browser />,
        subComponent: (
          <GroupsList
            groups={groups}
            categories={categories}
            channels={channels.data}
            currentSub={currentSub}
            click={(id) => {
              // 0 is this array position
              setCurrent(0);
              if (current == 0 && currentSub == id) {
                setContentExpanded(!contentExpanded);
                if (contentExpanded) {
                  setCurrentSub(undefined);
                } else {
                  setCurrentSub(id);
                }
              } else {
                setContentExpanded(true);
                setCurrentSub(id);
              }
            }}
          />
        ),
        componentWidth: 700,
      },
      {
        title: "Tutorials",
        icon: TutorialsIcon,
        component: null,
        subComponent: null,
        onClick: () => history.push("/lesson/view"),
        componentWidth: 700,
      },
      {
        title: "Support",
        icon: SupportIcon,
        component: <Support />,
        subComponent: null,
        componentWidth: 900,
      },
      {
        title: "Support Tickets",
        icon: SupportListIcon,
        component: <SupportTickets />,
        subComponent: null,
        componentWidth: 900,
      },
    ],
    [history, current, currentSub, contentExpanded, groups]
  );

  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const mainProps = useSpring({
    width: wideView ? `200px` : "64px",
    minWidth: wideView ? `200px` : "64px",
  });

  const userNameProps = useTrail(2, {
    config: { mass: 5, tension: 2000, friction: 180 },
    opacity: wideView ? 1 : 0,
    left: wideView ? 8 : 40,
    from: { opacity: 0, left: 40 },
  } as any);

  const controlsProps = useSpring({
    filter: `opacity(${wideView ? 1 : 0})`,
    transform: `scale(${wideView ? 1 : 0})`,
  } as any);

  const props = useSpring({
    width: contentExpanded
      ? `${width ?? sidebarIcons[current]?.componentWidth}px`
      : "0px",
    minWidth: contentExpanded
      ? `${width ?? sidebarIcons[current]?.componentWidth}px`
      : "0px",
  });

  const [Reality, doPrev, doNext, doPlay, doClear] = useLessonPlayer(
    currentLesson || ""
  );

  const clickActionButton = useCallback(
    (id: number) => {
      const icon = sidebarIcons[id];
      if (icon.subComponent) {
        setWideView(current == id ? !wideView : true);
      }
      if (!icon.subComponent && icon.component && !icon.onClick) {
        if (current == id && contentExpanded) {
          setContentExpanded(false);
        } else {
          setContentExpanded(true);
        }
        setCurrent(id);
        /* setContentExpanded(contentExpanded); */
      }
      if (icon.onClick) {
        icon.onClick();
      }
    },
    [current, wideView, contentExpanded, sidebarIcons]
  );

  const calc = (x: number, y: number) => [
    -(y - window.innerHeight / 2) / 60,
    (x - window.innerWidth / 2) / 60,
    1,
  ];
  const trans = (x: number, y: number, s: number) =>
    `perspective(50rem) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const [sidebarProps, setSidebarProps] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 170, friction: 60 },
  }));

  return (
    <>
      {(lessonPreview || chapterPreview || stepPreview || itemPreview) &&
        currentLesson &&
        Reality}
      <animated.div
        style={{
          right: "0px",
          top: "60px",
          transform: sidebarProps.xys.to(trans),
        }}
        ref={sidebarContainerRef}
        className="sidebar-container"
        onMouseEnter={() => {
          const app = document.getElementById("root");
          if (app) app.onmousemove = null;
          setSidebarProps({ xys: [0, 0, 1] });
        }}
        onMouseLeave={() => {
          const app = document.getElementById("root");
          if (app) {
            app.onmousemove = ({ clientX: x, clientY: y }) =>
              setSidebarProps({ xys: calc(x, y) });
          }
        }}
      >
        <animated.div
          onMouseOver={() => setWideView(true)}
          onMouseLeave={() => setWideView(false)}
          className="sidebar-buttons"
          style={mainProps}
        >
          <ShootingStar
            top={{ reverse: true, style: { animationDelay: "1s" } }}
            left={{ reverse: true, style: { animationDelay: "1s" } }}
            bottom={{ style: { animationDelay: "1s" } }}
            right={{ style: { animationDelay: "1s" } }}
            triggerOnComponentUpdate
          >
            <SidebarControls
              wideView={wideView}
              setWideView={() => setWideView(!wideView)}
              sidebarRef={sidebarContainerRef}
            />
          </ShootingStar>

          <div
            className={`control-buttons ${playing ? "enabled" : ""}`}
            style={{ opacity: playing ? 1 : 0.5 }}
          >
            <animated.div style={controlsProps}>
              <LeftArrowIcon onClick={playing ? doPrev : undefined} />
            </animated.div>
            <animated.div style={controlsProps}>
              <StopIcon
                onClick={
                  playing
                    ? () => {
                        doClear();
                        doPlay(false);
                      }
                    : undefined
                }
              />
            </animated.div>
            <div>
              <RightArrowIcon onClick={playing ? doNext : undefined} />
            </div>
          </div>

          <ActionButtons
            expanded={wideView}
            clickButton={clickActionButton}
            sidebarIcons={sidebarIcons}
          />

          <div className="logged-user">
            <div className="avatar-container">
              {user && user.avatar ? (
                <div className="button-round ">
                  <img
                    className="rounded-img"
                    src={user.avatar}
                    width="40px"
                    height="40px"
                    alt=""
                  />
                </div>
              ) : (
                <ButtonRound
                  onClick={voidFunction}
                  width="40px"
                  height="40px"
                  svg={DefaultUser}
                />
              )}
            </div>
            <div className="name-container">
              <animated.div style={userNameProps[0]} className="user-name">
                {user && user.username}
              </animated.div>
              <animated.div style={userNameProps[1]} className="user-role">
                Role
              </animated.div>
            </div>
          </div>
        </animated.div>

        <animated.div style={props} className="sidebar-expanded">
          <div className="sidebar-content">
            {sidebarIcons[current]?.component ? (
              sidebarIcons[current]?.component
            ) : (
              <></>
            )}
          </div>
        </animated.div>
      </animated.div>
    </>
  );
}
