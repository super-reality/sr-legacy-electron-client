import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import fs from "fs";
import { useMeasure } from "react-use";
import ReactCrop from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import ItemPreview from "../../lesson-player/item-preview";
import reduxAction from "../../../redux/reduxAction";
import CVEditor from "../recorder/CVEditor";
import userDataPath from "../../../../utils/userDataPath";
import AnchorCrop from "../../lesson-player/anchor-crop";

export default function VideoPreview(): JSX.Element {
  const {
    recordingData,
    videoNavigation,
    currentRecording,
    currentStep,
    currentItem,
    treeAnchors,
    treeItems,
    treeSteps,
    cropRecording,
  } = useSelector((state: AppState) => state.createLessonV2);
  const dispatch = useDispatch();
  const horPor = useRef<HTMLDivElement>(null);
  const vertPos = useRef<HTMLDivElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoHiddenRef = useRef<HTMLVideoElement>(null);
  const anchorImageRef = useRef<HTMLImageElement>(null);

  // eslint-disable-next-line global-require
  const { remote, nativeImage } = require("electron") as any;
  const userData = userDataPath();
  const fileName = `${userData}/capture.png`;
  const output = `${userData}/crop.png`;
  const [crop, setCrop] = useState<any>({});

  const doClick = useCallback(async () => {
    const image = nativeImage.createFromPath(fileName).crop({
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
    });
    // console.log(image);
    fs.writeFile(output, image.toPNG(), {}, () => {
      remote.getCurrentWindow().close();
    });
  }, [crop]);

  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

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
    </div>
  );
}
