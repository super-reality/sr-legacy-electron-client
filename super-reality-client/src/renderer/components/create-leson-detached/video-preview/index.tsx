import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMeasure } from "react-use";
import "react-image-crop/lib/ReactCrop.scss";
import { useDispatch, useSelector } from "react-redux";
import interact from "interactjs";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import ItemPreview from "../../lesson-player/item-preview";
import reduxAction from "../../../redux/reduxAction";
import CVEditor from "../recorder/CVEditor";
import AnchorCrop from "../../lesson-player/anchor-crop";
import FindBox from "../../lesson-player/find-box";
import { cursorChecker, voidFunction } from "../../../constants";
import { recordingPath } from "../../../electron-constants";

export default function VideoPreview(): JSX.Element {
  const { cvResult } = useSelector((state: AppState) => state.render);
  const {
    recordingData,
    videoNavigation,
    currentRecording,
    currentAnchor,
    currentStep,
    currentItem,
    treeAnchors,
    treeItems,
    treeSteps,
    cropRecording,
    videoScale,
    videoPos,
  } = useSelector((state: AppState) => state.createLessonV2);
  const dispatch = useDispatch();
  const horPor = useRef<HTMLDivElement>(null);
  const vertPos = useRef<HTMLDivElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoHiddenRef = useRef<HTMLVideoElement>(null);
  const anchorImageRef = useRef<HTMLImageElement>(null);

  const setVideoPos = useCallback(
    (arg: { x: number; y: number }) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          videoPos: arg,
        },
      });
    },
    [dispatch]
  );

  const setVideoScale = useCallback(
    (arg: number) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          videoScale: arg,
        },
      });
    },
    [dispatch]
  );

  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();
  const containerReactRef = useRef<HTMLDivElement | null>();
  const containerOutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerOutRef.current) {
      const containerWidth = videoCanvasRef.current?.width ?? 1920;
      const containerHeight = videoCanvasRef.current?.height ?? 1080;
      const innherWidth = containerOutRef.current.offsetWidth - 16;
      const innherHeight = containerOutRef.current.offsetHeight - 16;
      const scale = Math.min(
        (1 / containerWidth) * innherWidth,
        (1 / containerHeight) * innherHeight
      );
      const xPos = (innherWidth - containerWidth) / 2 + 8;
      const yPos = (innherHeight - containerHeight) / 2 + 8;

      setVideoScale(scale);
      setVideoPos({ x: xPos, y: yPos });
    }
  }, [
    currentRecording,
    containerOutRef,
    videoCanvasRef,
    setVideoScale,
    setVideoPos,
  ]);

  const cvEditor: any = useMemo(
    () => new CVEditor(videoHiddenRef.current, videoCanvasRef.current),
    []
  );

  const item = useMemo(
    () => (currentItem ? treeItems[currentItem] : undefined),
    [currentItem, treeItems]
  );

  const step = useMemo(
    () => (currentStep ? treeSteps[currentStep] : undefined),
    [currentStep, treeSteps]
  );

  useEffect(() => {
    if (step?.anchor && anchorImageRef.current && !recordingData.anchor) {
      const anchor = treeAnchors[step?.anchor];
      [anchorImageRef.current.src] = anchor?.templates || "";
      if (anchor) {
        reduxAction(dispatch, {
          type: "SET_CV_RESULT",
          arg: {
            id: anchor._id,
            width: anchorImageRef.current.width,
            height: anchorImageRef.current.height,
            x: width / 2 - anchorImageRef.current.width / 2,
            y: height / 2 - anchorImageRef.current.height / 2,
            sizeFactor: 1,
            dist: 0,
            time: 0,
          },
        });
      }
    }
  }, [dispatch, treeAnchors, width, height, step, recordingData]);

  useEffect(() => {
    if (currentRecording && videoCanvasRef.current && videoHiddenRef.current) {
      cvEditor.canvasElement = videoCanvasRef.current;
      cvEditor.videoElement = videoHiddenRef.current;
      videoHiddenRef.current.src = `${recordingPath}/vid-${currentRecording}.webm`;
      videoHiddenRef.current.addEventListener("loadeddata", () => {
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: {
            videoDuration: videoHiddenRef.current?.duration || 10,
            videoNavigation: [
              0,
              Math.round((videoHiddenRef.current?.duration || 10) * 500),
              (videoHiddenRef.current?.duration || 10) * 1000,
            ],
          },
        });
      });
    }
  }, [dispatch, currentRecording, videoCanvasRef, videoHiddenRef]);

  useEffect(() => {
    if (
      videoHiddenRef.current &&
      videoHiddenRef.current?.currentTime !== videoNavigation[1]
    ) {
      videoHiddenRef.current.currentTime = videoNavigation[1] / 1000;
    }
  }, [videoNavigation]);

  useEffect(() => {
    if (containerReactRef.current) {
      const newPos = { ...videoPos };
      interact(containerReactRef.current)
        .draggable({
          cursorChecker,
        })
        .on("dragmove", (event) => {
          if (containerReactRef.current) {
            newPos.x += event.dx;
            newPos.y += event.dy;
            containerReactRef.current.style.transform = `translate(${newPos.x}px, ${newPos.y}px) scale(${videoScale})`;
          }
        })
        .on("dragend", (event) => {
          setVideoPos(newPos);
        });

      return (): void => {
        if (containerReactRef.current)
          interact(containerReactRef.current).unset();
      };
    }
    return voidFunction;
  }, [containerReactRef, videoScale, videoPos]);

  const doScale = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      const newScale = videoScale + e.deltaY / -1000;

      if (videoScale > 0.1 && newScale < 4) {
        setVideoScale(newScale);
        /*
        if (containerOutRef.current) {
          const containerWidth = videoCanvasRef.current?.width ?? 1920;
          const containerHeight = videoCanvasRef.current?.height ?? 1080;
          const innherWidth = containerOutRef.current.offsetWidth;
          const innherHeight = containerOutRef.current.offsetHeight;
        }
        */
      }
    },
    [setVideoScale, videoScale]
  );

  return (
    <div className="video-preview-container-out" ref={containerOutRef}>
      <div
        ref={(ref) => {
          if (ref) containerRef(ref);
          containerReactRef.current = ref;
        }}
        className="video-preview-container"
        onWheel={doScale}
        style={{
          transform: `translate(${videoPos.x}px, ${videoPos.y}px) scale(${videoScale})`,
        }}
      >
        {!currentRecording && (
          <div className="video-preview-no-video">
            {`Select a recording to ${
              cropRecording ? "crop an anchor" : "preview"
            }`}
          </div>
        )}
        {currentRecording && (
          <>
            <canvas
              ref={videoCanvasRef}
              id="preview-video-canvas"
              className="video-preview-video"
            />
            <video
              ref={videoHiddenRef}
              muted
              id="video-hidden"
              style={{ display: "none" }}
            />
          </>
        )}
        <div
          key={`hor-${item?._id}` || ""}
          ref={horPor}
          className="horizontal-pos"
        />
        <div
          key={`ver-${item?._id}` || ""}
          ref={vertPos}
          className="vertical-pos"
        />
        <img ref={anchorImageRef} style={{ display: "none" }} />
        {item && !cropRecording && <ItemPreview />}
        {cropRecording && <AnchorCrop />}
        {!item && !cropRecording && (currentRecording || currentAnchor) && (
          <FindBox type="anchor" pos={cvResult} />
        )}
      </div>
    </div>
  );
}
