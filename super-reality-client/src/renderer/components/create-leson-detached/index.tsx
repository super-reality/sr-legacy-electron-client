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
import fs from "fs";
import { useSelector, useDispatch } from "react-redux";
import { hidden } from "colorette";
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import setTopMost from "../../../utils/electron/setTopMost";
import setMaximize from "../../../utils/electron/setMaximize";
import { ReactComponent as ButtonMinimize } from "../../../assets/svg/win-minimize.svg";
import { ReactComponent as ButtonMaximize } from "../../../assets/svg/win-maximize.svg";
import { ReactComponent as ButtonClose } from "../../../assets/svg/win-close.svg";

import setFocusable from "../../../utils/electron/setFocusable";
import setResizable from "../../../utils/electron/setResizable";
import Lesson from "./lessson";
import Recorder from "./recorder";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
import closeWindow from "../../../utils/electron/closeWindow";
import toggleMaximize from "../../../utils/electron/toggleMaximize";
import VideoNavigation from "./video-navigation";
import VideoPreview from "./video-preview";
import AnchorEdit from "./anchor-edit";
import AnchorTester from "./anchor-tester";
import LessonPlayer from "../lesson-player";
import { voidFunction } from "../../constants";
import useDebounce from "../../hooks/useDebounce";
import { RecordingJson } from "./recorder/types";
import VideoStatus from "./video-status";
import VideoData from "./video-data";
import { recordingPath, stepSnapshotPath } from "../../electron-constants";
import { getRawAudioData } from "./recorder/CVEditor";
import rawAudioToWaveform from "./lesson-utils/rawAudioToWaveform";
import {
  MODE_SOLID,
  MODE_TRANSPARENT,
  MODE_VOID,
} from "../../redux/slices/renderSlice";

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
    currentLesson,
    anchorTestView,
    lessonPreview,
    chapterPreview,
    stepPreview,
    itemPreview,
    videoNavigation,
    videoDuration,
    recordingData,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [openRecorder, setOpenRecorder] = useState<boolean>(false);
  const dispatch = useDispatch();
  useTransparentFix(false);

  const meoizedSpectrum = useMemo(() => {
    return (
      <div className="spectrum-container">
        {recordingData.spectrum.map((n, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`spectrum-key-${i}`}
            className="spectrum-bar"
            style={{ height: `${n * 100}%` }}
          />
        ))}
      </div>
    );
  }, [recordingData]);

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

  const debounceVideoNav = useCallback(
    (n: readonly number[]) => {
      debouncer(() => setVideoNavPos([...n]));
      const el = document.getElementById("video-hidden") as HTMLVideoElement;
      if (el) el.currentTime = n[1] / 1000;
    },
    [debouncer]
  );

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
    reduxAction(dispatch, { type: "SET_OVERLAY_TRANSPARENT", arg: MODE_VOID });
    setFocusable(false);
    setTimeout(() => {
      setTopMost(true);
      reduxAction(dispatch, {
        type: "SET_OVERLAY_TRANSPARENT",
        arg: MODE_TRANSPARENT,
      });
    }, 2000);
    setMaximize(true);
    setResizable(false);
  }, [dispatch]);

  const setSolid = useCallback(() => {
    reduxAction(dispatch, { type: "SET_OVERLAY_TRANSPARENT", arg: MODE_SOLID });
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

  useEffect(() => {
    let json: RecordingJson = {
      step_data: [],
      spectrum: [],
    };
    if (currentRecording) {
      try {
        const file = fs
          .readFileSync(`${stepSnapshotPath}/${currentRecording}.webm.json`)
          .toString("utf8");
        json = JSON.parse(file);
      } catch (e) {
        console.warn(
          `.json for recording ${currentRecording} does not exist! Some data about it might be unavailable.`
        );
      }
      getRawAudioData(`${recordingPath}aud-${currentRecording}.webm`)
        .then((data) => {
          reduxAction(dispatch, {
            type: "SET_RECORDING_DATA",
            arg: { spectrum: rawAudioToWaveform(data) },
          });
        })
        .catch((e) => {
          console.warn(
            `recording ${currentRecording} does not have any local audio files.`
          );
        });
    }
    reduxAction(dispatch, {
      type: "SET_RECORDING_DATA",
      arg: json,
    });
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });
  }, [dispatch, currentRecording]);

  if (overlayTransparent == MODE_TRANSPARENT)
    return (
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
        {(lessonPreview || chapterPreview || stepPreview || itemPreview) &&
          currentLesson && (
            <LessonPlayer lessonId={currentLesson} onFinish={setSolid} />
          )}
      </div>
    );
  if (overlayTransparent == MODE_SOLID) {
    return (
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
                <AnchorEdit
                  anchorId={currentAnchor}
                  setTransparent={setTransparent}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="preview">
              <VideoPreview />
            </div>
          </div>
          <div className="nav">
            <VideoStatus />
            <VideoNavigation
              domain={videoNavDomain}
              defaultValues={videoNavigation}
              ticksNumber={100}
              callback={debounceVideoNav}
              slideCallback={debounceVideoNav}
            />
            <VideoData />
            {meoizedSpectrum}
          </div>
        </div>
      </div>
    );
  }
  return <></>;
}
