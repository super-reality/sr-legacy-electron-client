/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef } from "react";
import interact from "interactjs";
import "./index.scss";
import fs from "fs";
import { useSelector, useDispatch } from "react-redux";
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";

import Lesson from "./lessson";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
import VideoPreview from "./video-preview";
import AnchorTester from "./anchor-tester";
import LessonPlayer from "../lesson-player";
import { voidFunction } from "../../constants";
import { RecordingJson } from "../recorder/types";
import VideoStatus from "./video-status";
import { recordingPath, stepSnapshotPath } from "../../electron-constants";
import { getRawAudioData } from "../recorder/CVEditor";
import rawAudioToWaveform from "./lesson-utils/rawAudioToWaveform";
import Windowlet from "../windowlet";
import { MODE_HOME } from "../../redux/slices/renderSlice";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";
import TopMenuBar from "../top-menu-bar";
import setFocusable from "../../../utils/electron/setFocusable";
import EditorSidebar from "./editor-sidebar";
import setTopMost from "../../../utils/electron/setTopMost";
import LeftPanelWrapper from "./left-panel-wrapper";

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

export default function CreateLessonDetached(): JSX.Element {
  const resizeContainer = useRef<HTMLDivElement>(null);

  const {
    currentRecording,
    currentLesson,
    anchorTestView,
    lessonPreview,
    chapterPreview,
    stepPreview,
    itemPreview,
    openPanel,
  } = useSelector((state: AppState) => state.createLessonV2);
  const dispatch = useDispatch();
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
        .catch(() => {
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
        {(lessonPreview || chapterPreview || stepPreview || itemPreview) &&
          currentLesson && (
            <LessonPlayer
              lessonId={currentLesson}
              onFinish={() => {
                reduxAction(dispatch, {
                  type: "CREATE_LESSON_V2_DATA",
                  arg: {
                    lessonPreview: false,
                    chapterPreview: false,
                    stepPreview: false,
                    itemPreview: false,
                    anchorTestView: false,
                    previewing: false,
                    previewOne: false,
                  },
                });
              }}
            />
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
      onClose={() => {
        reduxAction(dispatch, {
          type: "SET_APP_MODE",
          arg: MODE_HOME,
        });
      }}
    >
      <div className="main-container">
        <div className="edit">
          <div
            className="creator"
            style={{ width: "340px" }}
            ref={resizeContainer}
          >
            {/* For shooting star animation - START */}
            <span />
            <span />
            {/* For shooting start animation - END */}
            <Lesson />
          </div>
          {openPanel && <LeftPanelWrapper />}
          <div className="animate-gradient preview">
            {/* For shooting star animation - START */}
            <span />
            <span />
            {/* For shooting start animation - END */}
            <VideoPreview />
          </div>
          <EditorSidebar />
        </div>
        <VideoStatus />
      </div>
    </Windowlet>
  );
}
