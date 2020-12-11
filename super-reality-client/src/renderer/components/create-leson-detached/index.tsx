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
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";

import Lesson from "./lessson";
import Recorder from "./recorder";
import minimizeWindow from "../../../utils/electron/minimizeWindow";
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
import Windowlet from "../windowlet";
import { MODE_HOME } from "../../redux/slices/renderSlice";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";

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
  const resizeContainerAnchor = useRef<HTMLDivElement>(null);

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
  }, [resizeContainer]);

  const createRecorder = useCallback(() => {
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

  const isTransparent =
    openRecorder ||
    anchorTestView ||
    lessonPreview ||
    chapterPreview ||
    stepPreview ||
    itemPreview;

  if (isTransparent) {
    return (
      <>
        {openRecorder && (
          <Recorder
            onFinish={() => {
              setOpenRecorder(false);
            }}
          />
        )}
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
            <Lesson createRecorder={createRecorder} />
          </div>
          {currentAnchor !== undefined ? (
            <div
              className="anchor-edit"
              style={{ width: "340px" }}
              ref={resizeContainerAnchor}
            >
              <AnchorEdit anchorId={currentAnchor} />
            </div>
          ) : (
            <></>
          )}
          <div className="animate-gradient preview">
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
    </Windowlet>
  );
}
/* eslint-disable dot-notation */
