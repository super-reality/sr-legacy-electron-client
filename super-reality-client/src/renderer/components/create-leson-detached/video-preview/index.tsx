import React, { useCallback, useEffect, useMemo, useRef } from "react";
import fs from "fs";
import path from "path";
import "react-image-crop/lib/ReactCrop.scss";
import { useDispatch, useSelector } from "react-redux";
import interact from "interactjs";
import store, { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import ItemPreview from "../../lesson-player/item-preview";
import reduxAction from "../../../redux/reduxAction";
import CVEditor from "../recorder/CVEditor";
import AnchorCrop from "../../lesson-player/anchor-crop";
import VideoCrop from "../../lesson-player/video-crop";
import { cursorChecker, voidFunction } from "../../../constants";
import { itemsPath, recordingPath } from "../../../electron-constants";
import StepView from "../../lesson-player/step-view";
import AnchorBox from "../../../items/boxes/anchor-box";
import EditAnchorButton from "./edit-anchor-button";
import timestampToTime from "../../../../utils/timestampToTime";
import setCanvasSource from "../../../redux/utils/setCanvasSource";
import downloadFile from "../../../../utils/api/downloadFIle";
import getPublicPath from "../../../../utils/electron/getPublicPath";

const zoomLevels = [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6];

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
    videoScale,
    videoPos,
    canvasSourceType,
    canvasSource,
    previewMode,
  } = useSelector((state: AppState) => state.createLessonV2);
  const dispatch = useDispatch();
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
  const fuildsOutRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (containerOutRef.current && videoCanvasRef.current) {
        const containerWidth =
          canvasSourceType && videoCanvasRef.current
            ? videoCanvasRef.current.width
            : 1920;
        const containerHeight =
          canvasSourceType && videoCanvasRef.current
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
  }, [currentRecording, containerOutRef, videoCanvasRef, canvasSourceType]);

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
      !canvasSourceType &&
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

    if (videoCanvasRef.current) cvEditor.canvasElement = videoCanvasRef.current;
    if (videoHiddenRef.current) cvEditor.videoElement = videoHiddenRef.current;
    //
    if (
      canvasSourceType == "recording" &&
      canvasSource &&
      videoHiddenRef.current
    ) {
      const newSrc = `${recordingPath}/vid-${canvasSource}.webm`;
      if (videoHiddenRef.current.src !== newSrc) {
        videoHiddenRef.current.src = newSrc;
        videoHiddenRef.current.addEventListener("loadeddata", () => {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_DATA",
            arg: {
              videoDuration: videoHiddenRef.current?.duration || 10,
            },
          });
        });
      }
    }
    if (canvasSourceType == "url" && canvasSource && videoCanvasRef) {
      const fileName = canvasSource.split("/")?.pop() || "";
      const file = path.join(itemsPath, fileName);
      if (!fs.existsSync(file)) {
        downloadFile(canvasSource, file).then(() => {
          const img = new Image();
          img.onload = () => {
            if (videoCanvasRef.current) {
              videoCanvasRef.current.width = img.width;
              videoCanvasRef.current.height = img.height;
              const ctx = videoCanvasRef.current.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                reduxAction(dispatch, {
                  type: "CREATE_LESSON_V2_TRIGGER_CV_MATCH",
                  arg: null,
                });
              }
            }
          };
          img.src = file;
        });
      } else {
        const img = new Image();
        img.onload = () => {
          if (videoCanvasRef.current) {
            videoCanvasRef.current.width = img.width;
            videoCanvasRef.current.height = img.height;
            const ctx = videoCanvasRef.current.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              reduxAction(dispatch, {
                type: "CREATE_LESSON_V2_TRIGGER_CV_MATCH",
                arg: null,
              });
            }
          }
        };
        img.src = file;
      }
    }
  }, [
    dispatch,
    currentRecording,
    step,
    canvasSource,
    videoCanvasRef,
    videoHiddenRef,
  ]);

  useEffect(() => {
    const st = store.getState().createLessonV2.treeSteps[currentStep || ""];
    if (currentStep && st) {
      const nav: number[] = [
        ...store.getState().createLessonV2.videoNavigation,
      ] || [0, 0, 0];
      nav[1] = timestampToTime(st.recordingTimestamp || "00:00:00");
      if (st.snapShot) {
        setCanvasSource("url", st.snapShot);
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: {
            videoNavigation: nav,
          },
        });
      } else if (st.recordingId) {
        setCanvasSource("recording", st.recordingId);
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: {
            currentRecording: st.recordingId,
            videoNavigation: nav,
          },
        });
      }
    } else {
      setCanvasSource(undefined, "");
    }
  }, [currentStep]);

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
        .on("dragend", () => {
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
      const closest = zoomLevels.reduce((prev, curr) => {
        return Math.abs(curr - videoScale) < Math.abs(prev - videoScale)
          ? curr
          : prev;
      });
      const currentLevel = zoomLevels.findIndex((n) => n == closest);

      const newScale = zoomLevels[currentLevel + (e.deltaY > 0 ? -1 : 1)];

      if (newScale) {
        setVideoScale(newScale);
        const scaleDiff = (1 / newScale) * videoScale;
        if (containerOutRef.current && videoCanvasRef.current) {
          const containerWidth = videoCanvasRef.current.width;
          const containerHeight = videoCanvasRef.current.height;
          const innherWidth = containerOutRef.current.offsetWidth;
          const innherHeight = containerOutRef.current.offsetHeight;
          const centerXPos = (innherWidth - containerWidth) / 2;
          const centerYPos = (innherHeight - containerHeight) / 2;

          const xDffToCenter = centerXPos - videoPos.x;
          const yDiffToCenter = centerYPos - videoPos.y;
          setVideoPos({
            x: centerXPos - xDffToCenter / scaleDiff,
            y: centerYPos - yDiffToCenter / scaleDiff,
          });
        }
      }
    },
    [videoPos, videoScale, containerOutRef, videoCanvasRef]
  );

  return (
    <>
      <div
        className="video-preview-container-out"
        ref={containerOutRef}
        onWheel={doScale}
      >
        <iframe
          src={`${getPublicPath()}/fluid-simulation/index.html`}
          className="fluids-iframe"
          ref={fuildsOutRef}
          onWheel={doScale}
        />
        {videoScale !== 1 && (
          <div className="zoom-container">
            Zoom level: {Math.round(videoScale * 100)}%
          </div>
        )}
        <div
          ref={containerRef}
          className="video-preview-container"
          style={{
            transform: `translate(${videoPos.x}px, ${videoPos.y}px) scale(${videoScale})`,
          }}
        >
          <canvas
            style={{
              display: canvasSourceType ? "block" : "none",
            }}
            ref={videoCanvasRef}
            id="preview-video-canvas"
            width="1920"
            height="1080"
            className="video-preview-video"
          />
          {canvasSourceType ? (
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
            id="horizontal-pos"
            className="horizontal-pos"
          />
          <div
            key={`ver-${item?._id}` || ""}
            id="vertical-pos"
            className="vertical-pos"
          />
          <div key={`xy-${item?._id}` || ""} id="xy-pos" className="xy-pos">
            <div id="xy-pos-text" className="xy-pos-text" />
          </div>
          <img ref={anchorImageRef} style={{ display: "none" }} />
          {item && currentItem && currentStep && previewMode == "IDLE" && (
            <>
              <AnchorBox pos={cvResult} />
              <EditAnchorButton anchor={step?.anchor || null} pos={cvResult} />
              <ItemPreview
                showAnchor={false}
                stepId={currentStep}
                itemId={currentItem}
              />
            </>
          )}
          {step && !currentItem && currentStep && previewMode == "IDLE" && (
            <>
              <AnchorBox pos={cvResult} />
              <EditAnchorButton anchor={step?.anchor} pos={cvResult} />
              <StepView stepId={currentStep} onSucess={voidFunction} />
            </>
          )}
          {previewMode == "CREATE_ANCHOR" && <AnchorCrop />}
          {previewMode == "ADDTO_ANCHOR" &&
            !item &&
            (currentRecording || currentAnchor) && <AnchorBox pos={cvResult} />}
          {previewMode == "TRIM_VIDEO" && <VideoCrop />}
        </div>
      </div>
    </>
  );
}
