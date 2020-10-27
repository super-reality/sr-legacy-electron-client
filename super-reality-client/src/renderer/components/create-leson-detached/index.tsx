/* eslint-disable dot-notation */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import interact from "interactjs";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import setTopMost from "../../../utils/setTopMost";
import setMaximize from "../../../utils/setMaximize";
import { ReactComponent as ButtonMinimize } from "../../../assets/svg/win-minimize.svg";
import { ReactComponent as ButtonMaximize } from "../../../assets/svg/win-maximize.svg";
import { ReactComponent as ButtonClose } from "../../../assets/svg/win-close.svg";

import setFocusable from "../../../utils/setFocusable";
import setResizable from "../../../utils/setResizable";
import Lesson from "./lessson";
import Recorder from "./recorder";
import minimizeWindow from "../../../utils/minimizeWindow";
import closeWindow from "../../../utils/closeWindow";
import toggleMaximize from "../../../utils/toggleMaximize";
import VideoNavigation from "./video-navigation";
import VideoPreview from "./video-preview";
import AnchorEdit from "./anchor-edit";
import AnchorTester from "./anchor-tester";
import LessonPlayer from "../lesson-player";
import { voidFunction } from "../../constants";
import useDebounce from "../../hooks/useDebounce";

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

function TopBar() {
  const onMinimize = useCallback(() => {
    minimizeWindow();
  }, []);

  const onMaximize = useCallback(() => {
    toggleMaximize();
  }, []);

  const onCLose = useCallback(() => {
    closeWindow();
  }, []);

  return (
    <div className="top-bar">
      <div className="name">Super Reality</div>
      <div className="buttons">
        <div className="minimize" onClick={onMinimize}>
          <ButtonMinimize style={{ margin: "auto" }} />
        </div>
        <div className="maximize" onClick={onMaximize}>
          <ButtonMaximize style={{ margin: "auto" }} />
        </div>
        <div className="close" onClick={onCLose}>
          <ButtonClose style={{ margin: "auto" }} />
        </div>
      </div>
    </div>
  );
}

export default function CreateLessonDetached(): JSX.Element {
  const resizeContainer = useRef<HTMLDivElement>(null);
  const resizeContainerAnchor = useRef<HTMLDivElement>(null);
  const { overlayTransparent } = useSelector((state: AppState) => state.render);
  const {
    currentAnchor,
    currentRecording,
    anchorTestView,
    stepPreview,
    itemPreview,
    videoNavigation,
    videoDuration,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [openRecorder, setOpenRecorder] = useState<boolean>(false);
  const dispatch = useDispatch();
  useTransparentFix(false);

  const setVideoNavPos = useCallback(
    (n: readonly number[]) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { videoNavigation: [...n] },
      });
    },
    [dispatch]
  );

  const debouncer = useDebounce(500);

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
  }, [overlayTransparent, resizeContainer]);

  const setTransparent = useCallback(() => {
    reduxAction(dispatch, { type: "SET_OVERLAY_TRANSPARENT", arg: true });
    setFocusable(false);
    setTopMost(true);
    setMaximize(true);
    setResizable(false);
  }, [dispatch]);

  const setSolid = useCallback(() => {
    reduxAction(dispatch, { type: "SET_OVERLAY_TRANSPARENT", arg: false });
    setFocusable(true);
    setTopMost(false);
    setMaximize(false);
    setResizable(true);
  }, [dispatch]);

  const createRecorder = useCallback(() => {
    setTransparent();
    setOpenRecorder(true);
  }, []);

  const videoNavDomain = useMemo(() => [0, Math.round(videoDuration * 1000)], [
    videoDuration,
  ]);

  return overlayTransparent ? (
    <div className="transparent-container click-through">
      {openRecorder && (
        <Recorder
          onFinish={() => {
            setOpenRecorder(false);
            setSolid();
          }}
        />
      )}
      {anchorTestView && (
        <>
          <AnchorTester
            onFinish={() => {
              setSolid();
            }}
          />
        </>
      )}
      {(stepPreview || itemPreview) && <LessonPlayer onFinish={setSolid} />}
    </div>
  ) : (
    <div className="solid-container">
      <TopBar />
      <div className="main-container">
        <div className="edit">
          <div
            className="creator"
            style={{ width: "340px" }}
            ref={resizeContainer}
          >
            <Lesson
              createRecorder={createRecorder}
              setTransparent={setTransparent}
            />
          </div>
          {currentAnchor !== undefined ? (
            <div
              className="anchor-edit"
              style={{ width: "340px" }}
              ref={resizeContainerAnchor}
            >
              <AnchorEdit setTransparent={setTransparent} />
            </div>
          ) : (
            <></>
          )}
          <div className="preview">
            <VideoPreview />
          </div>
        </div>
        <div className="nav">
          <VideoNavigation
            domain={videoNavDomain}
            defaultValues={videoNavigation}
            ticksNumber={100}
            callback={(n) => debouncer(() => setVideoNavPos(n))}
            slideCallback={(n) => debouncer(() => setVideoNavPos(n))}
          />
        </div>
      </div>
    </div>
  );
}
