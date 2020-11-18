import React, { useCallback, useEffect, useMemo, useRef } from "react";
import fs from "fs";
import "react-image-crop/lib/ReactCrop.scss";
import { useDispatch, useSelector } from "react-redux";
import interact from "interactjs";
import store, { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import ItemPreview from "../../lesson-player/item-preview";
import reduxAction from "../../../redux/reduxAction";
import CVEditor from "../recorder/CVEditor";
import AnchorCrop from "../../lesson-player/anchor-crop";
import { cursorChecker, voidFunction } from "../../../constants";
import { itemsPath, recordingPath } from "../../../electron-constants";
import StepView from "../../lesson-player/step-view";
import AnchorBox from "../../lesson-player/anchor-box";
import EditAnchorButton from "./edit-anchor-button";
import timestampToTime from "../../../../utils/timestampToTime";

export default function VideoPreview(): JSX.Element {
  const { cvResult } = useSelector((state: AppState) => state.render);
  const {
    videoNavigation,
    currentRecording,
    currentAnchor,
    currentStep,
    currentItem,
    treeItems,
    treeSteps,
    cropRecording,
    videoScale,
    videoPos,
    canvasSource,
    currentCanvasSource,
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

  const containerRef = useRef<HTMLDivElement>(null);
  const containerOutRef = useRef<HTMLDivElement>(null);

  const shouldDisplayPreview = useMemo(
    () => currentRecording || currentCanvasSource,
    [currentRecording, currentCanvasSource]
  );

  useEffect(() => {
    setTimeout(() => {
      if (containerOutRef.current && videoCanvasRef.current) {
        const containerWidth =
          shouldDisplayPreview && videoCanvasRef.current
            ? videoCanvasRef.current.width
            : 1920;
        const containerHeight =
          shouldDisplayPreview && videoCanvasRef.current
            ? videoCanvasRef.current.height
            : 1080;
        const innherWidth = containerOutRef.current.offsetWidth - 16;
        const innherHeight = containerOutRef.current.offsetHeight - 16;
        const scale = Math.min(
          (1 / containerWidth) * innherWidth,
          (1 / containerHeight) * innherHeight
        );
        const xPos = (innherWidth - containerWidth) / 2 + 8;
        const yPos = (innherHeight - containerHeight) / 2 + 8;

        const newScale = Math.round(scale * 10) / 10;
        if (newScale < 4 && newScale > 0.1) {
          setVideoScale(newScale);
          setVideoPos({ x: xPos, y: yPos });
        }
      }
    }, 500);
  }, [
    currentRecording,
    containerOutRef,
    videoCanvasRef,
    setVideoScale,
    setVideoPos,
    shouldDisplayPreview,
  ]);

  const cvEditor: any = useMemo(() => new CVEditor(), []);

  const item = useMemo(
    () => (currentItem ? treeItems[currentItem] : undefined),
    [currentItem, treeItems]
  );

  const step = useMemo(
    () => (currentStep ? treeSteps[currentStep] : undefined),
    [currentStep, treeSteps]
  );

  useEffect(() => {
    if (
      !shouldDisplayPreview &&
      step?.anchor &&
      anchorImageRef.current &&
      containerRef.current
    ) {
      const anchor = store.getState().createLessonV2.treeAnchors[step?.anchor];
      [anchorImageRef.current.src] = anchor?.templates || "";
      if (anchor) {
        reduxAction(dispatch, {
          type: "SET_CV_RESULT",
          arg: {
            id: anchor._id,
            width: anchorImageRef.current.width,
            height: anchorImageRef.current.height,
            x:
              containerRef.current.offsetWidth / 2 -
              anchorImageRef.current.width / 2,
            y:
              containerRef.current.offsetHeight / 2 -
              anchorImageRef.current.height / 2,
            sizeFactor: 1,
            dist: 0,
            time: 0,
          },
        });
      }
    }
  }, [dispatch, currentRecording, canvasSource, shouldDisplayPreview, step]);

  useEffect(() => {
    if (currentRecording && videoCanvasRef.current && videoHiddenRef.current) {
      if (videoCanvasRef.current)
        cvEditor.canvasElement = videoCanvasRef.current;
      if (videoHiddenRef.current)
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
    const st = store.getState().createLessonV2.treeSteps[currentStep || ""];
    if (currentStep && st) {
      const nav: number[] = [
        ...store.getState().createLessonV2.videoNavigation,
      ] || [0, 0, 0];
      nav[1] = timestampToTime(st.recordingTimestamp || "00:00:00");
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          currentRecording: st.recordingId,
          currentCanvasSource: undefined,
          canvasSource: `step ${st.name}`,
          videoNavigation: nav,
        },
      });
    } else {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          currentRecording: undefined,
          currentCanvasSource: undefined,
          canvasSource: `no source`,
        },
      });
    }
  }, [currentStep, videoCanvasRef]);

  useEffect(() => {
    if (
      videoHiddenRef.current &&
      videoHiddenRef.current?.currentTime !== videoNavigation[1]
    ) {
      videoHiddenRef.current.currentTime = videoNavigation[1] / 1000;
    }
  }, [videoNavigation]);

  useEffect(() => {
    if (containerRef.current) {
      const newPos = { ...videoPos };
      interact(containerRef.current)
        .draggable({
          cursorChecker,
        })
        .on("dragmove", (event) => {
          if (containerRef.current) {
            newPos.x += event.dx;
            newPos.y += event.dy;
            containerRef.current.style.transform = `translate(${newPos.x}px, ${newPos.y}px) scale(${videoScale})`;
          }
        })
        .on("dragend", (event) => {
          setVideoPos(newPos);
        });

      return (): void => {
        if (containerRef.current) interact(containerRef.current).unset();
      };
    }
    return voidFunction;
  }, [containerRef, videoScale, videoPos]);

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
        ref={containerRef}
        className="video-preview-container"
        onWheel={doScale}
        style={{
          transform: `translate(${videoPos.x}px, ${videoPos.y}px) scale(${videoScale})`,
        }}
      >
        <canvas
          style={{
            display: shouldDisplayPreview ? "block" : "none",
          }}
          ref={videoCanvasRef}
          id="preview-video-canvas"
          className="video-preview-video"
        />
        {shouldDisplayPreview ? (
          <video
            ref={videoHiddenRef}
            muted
            id="video-hidden"
            style={{ display: "none" }}
          />
        ) : (
          <div className="video-preview-no-video">Nothing to preview</div>
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
        {item && currentItem && currentStep && !cropRecording && (
          <>
            <AnchorBox pos={cvResult} />
            <EditAnchorButton pos={cvResult} />
            <ItemPreview
              showAnchor={false}
              stepId={currentStep}
              itemId={currentItem}
            />
          </>
        )}
        {step && !currentItem && currentStep && !cropRecording && (
          <>
            <AnchorBox pos={cvResult} />
            <EditAnchorButton pos={cvResult} />
            <StepView stepId={currentStep} onSucess={() => {}} />
          </>
        )}
        {cropRecording && <AnchorCrop />}
        {!item && !cropRecording && (currentRecording || currentAnchor) && (
          <AnchorBox pos={cvResult} />
        )}
      </div>
    </div>
  );
}
