/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useRef } from "react";
import interact from "interactjs";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";

import Lesson from "./lessson";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
import VideoPreview from "./video-preview";
import AnchorTester from "./anchor-tester";
import { voidFunction } from "../../constants";
import VideoStatus from "./video-status";
import Windowlet from "../windowlet";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";
import TopMenuBar from "../top-menu-bar";
import setFocusable from "../../../utils/electron/setFocusable";
import setTopMost from "../../../utils/electron/setTopMost";
import LeftPanelWrapper from "./left-panel-wrapper";
import ShootingStar from "../animations";

function setMocks() {
  reduxAction(store.dispatch, {
    type: "CREATE_LESSON_V2_DATA",
    arg: {
      lessons: [{ _id: "5f7e0b2bf658117398cb4aca", name: "Test Lesson" }],
    },
  });
}

const restrictMinSize =
  interact.modifiers &&
  interact.modifiers.restrictSize({
    min: { width: 100, height: 100 },
  });

function CreateLesson(): JSX.Element {
  const resizeContainer = useRef<HTMLDivElement>(null);

  const {
    anchorTestView,
    lessonPreview,
    chapterPreview,
    stepPreview,
    itemPreview,
    openPanel,
  } = useSelector((state: AppState) => state.createLessonV2);
  const dispatch = useDispatch();
  const history = useHistory();
  useTransparentFix(false);

  useEffect(() => {
    setMocks();
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }, []);

  useEffect(() => {
    if (resizeContainer.current) {
      interact(resizeContainer.current)
        .resizable({
          edges: { left: false, right: true, bottom: false, top: false },
          modifiers: [restrictMinSize],
          inertia: true,
        } as any)
        .on("resizemove", (event) => {
          const { target } = event;
          target.style.width = `${event.rect.width - 4}px`;
        });

      return (): void => {
        if (resizeContainer.current) interact(resizeContainer.current).unset();
      };
    }
    return voidFunction;
  }, [resizeContainer]);

  const isTransparent = useMemo(
    () =>
      anchorTestView ||
      lessonPreview ||
      chapterPreview ||
      stepPreview ||
      itemPreview,
    [anchorTestView, lessonPreview, chapterPreview, stepPreview, itemPreview]
  );

  useEffect(() => {
    if (isTransparent) {
      setFocusable(false);
      setTopMost(true);
      setTimeout(() => {
        setFocusable(false);
        setTopMost(true);
      }, 500);
    } else {
      setFocusable(true);
      setTopMost(false);
    }
  }, [isTransparent]);

  if (isTransparent) {
    return (
      <>
        {anchorTestView && (
          <>
            <AnchorTester
              onFinish={() => {
                reduxAction(dispatch, {
                  type: "CREATE_LESSON_V2_DATA",
                  arg: {
                    anchorTestView: false,
                  },
                });
              }}
            />
          </>
        )}
      </>
    );
  }

  const primarySize = getPrimaryMonitor().workArea;

  return (
    <Windowlet
      width={primarySize.width}
      height={primarySize.height}
      title="Super Reality"
      topBarContent={<TopMenuBar />}
      onMinimize={minimizeWindow}
      onClose={() => history.push("/")}
    >
      <div className="main-container">
        <div className="edit">
          <div
            className="creator"
            style={{ width: "340px" }}
            ref={resizeContainer}
          >
            {/* For shooting star animation - START */}
            <ShootingStar
              style={{ animationDelay: "1.5s", top: 0 }}
              direction="right"
            />
            <ShootingStar
              style={{ animationDelay: "1.75s", right: 0 }}
              direction="bottom"
            />
            {/* For shooting start animation - END */}
            <Lesson />
          </div>
          {openPanel && <LeftPanelWrapper />}
          <div className="animate-gradient preview">
            {/* For shooting star animation - START */}
            <ShootingStar
              style={{ animationDelay: "2s", bottom: 0 }}
              direction="right"
            />
            <ShootingStar
              style={{ animationDelay: "1.75s", left: 0 }}
              direction="bottom"
            />
            {/* For shooting start animation - END */}
            <VideoPreview />
          </div>
        </div>
        <VideoStatus />
      </div>
    </Windowlet>
  );
}

// CreateLesson.whyDidYouRender = true;

export default CreateLesson;
