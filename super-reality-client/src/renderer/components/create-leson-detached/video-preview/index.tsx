import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useMeasure } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import ItemPreview from "../../lesson-player/item-preview";
import reduxAction from "../../../redux/reduxAction";
import CVEditor from "../recorder/CVEditor";
import userDataPath from "../../../../utils/userDataPath";

export default function VideoPreview(): JSX.Element {
  const {
    recordingData,
    videoNavigation,
    currentRecording,
    currentItem,
    treeAnchors,
    treeItems,
  } = useSelector((state: AppState) => state.createLessonV2);
  const dispatch = useDispatch();
  const horPor = useRef<HTMLDivElement>(null);
  const vertPos = useRef<HTMLDivElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoHiddenRef = useRef<HTMLVideoElement>(null);
  const anchorImageRef = useRef<HTMLImageElement>(null);

  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  const cvEditor: any = useMemo(
    () => new CVEditor(videoHiddenRef.current, videoCanvasRef.current),
    []
  );

  const item = useMemo(
    () => (currentItem ? treeItems[currentItem] : undefined),
    [currentItem, treeItems]
  );

  useEffect(() => {
    if (item?.anchor && anchorImageRef.current && !recordingData.anchor) {
      const anchor = treeAnchors[item?.anchor];
      [anchorImageRef.current.src] = anchor?.templates || "";
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
  }, [dispatch, treeAnchors, item, width, height]);

  useEffect(() => {
    if (currentRecording && videoCanvasRef.current && videoHiddenRef.current) {
      cvEditor.canvasElement = videoCanvasRef.current;
      cvEditor.videoElement = videoHiddenRef.current;
      videoHiddenRef.current.src = `${userDataPath()}/step/media/vid-${currentRecording}.webm`;
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

  return (
    <div ref={containerRef} className="video-preview-container">
      {!currentRecording && (
        <div className="video-preview-no-video">
          Select a recording to preview
        </div>
      )}
      {currentRecording && (
        <>
          <canvas ref={videoCanvasRef} className="video-preview-video" />
          <video
            ref={videoHiddenRef}
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
      {item && <ItemPreview />}
    </div>
  );
}
