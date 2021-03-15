import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import fs from "fs";
import { useDispatch, useSelector } from "react-redux";
import { BasePanelViewProps } from "../viewTypes";
import {
  recordingPath,
  stepSnapshotPath,
} from "../../../../electron-constants";
import BaseSlider from "../../../base-slider";
import ButtonCheckbox from "../../button-checkbox";
import reduxAction from "../../../../redux/reduxAction";
import store, { AppState } from "../../../../redux/stores/renderer";
import { RecordingCanvasTypeValue } from "../../../../api/types/step/step";
import timestampToTime from "../../../../../utils/timestampToTime";
import useDebounce from "../../../../hooks/useDebounce";
import uploadFileToS3 from "../../../../../utils/api/uploadFileToS3";
import usePopupVideoTrim from "../../../../hooks/usePopupVideoTrim";
import ButtonSimple from "../../../button-simple";
import setStatus from "../../lesson-utils/setStatus";
import cropVideo from "../../../../../utils/cropVideo";
import userDataPath from "../../../../../utils/files/userDataPath";
import { Rectangle } from "../../../../../types/utils";
import { ItemVideo } from "../../../../items/item";
import updateItem from "../../lesson-utils/updateItem";
import usePopupLoading from "../../../../hooks/usePopupLoading";

export function RecordingsTrimList(
  props: BasePanelViewProps<RecordingCanvasTypeValue>
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { select, data, open } = props;

  const [videos, setVideos] = useState<string[]>([]);

  const doUnCheck = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      select("Recording", null);
    },
    [select]
  );

  useEffect(() => {
    const newFiles: string[] = [];
    const files = fs.readdirSync(stepSnapshotPath);
    files
      .filter((f) => f.indexOf(".webm.json") > -1)
      .map((f) => f.replace(".webm.json", ""))
      .forEach((f) => newFiles.push(f));
    setVideos(newFiles);
  }, []);

  return (
    <>
      {videos.map((id) => (
        <ButtonCheckbox
          text={id}
          margin="8px auto"
          key={`recording-button-${id}`}
          showDisabled={false}
          check={false}
          onButtonClick={() => open(id)}
          onCheckClick={doUnCheck}
        />
      ))}
    </>
  );
}

const userData = userDataPath();
const videoCropFileName = `${userData}/crop.webm`;

export function RecordingsTrimView(
  props: BasePanelViewProps<RecordingCanvasTypeValue> & {
    id: string;
  }
) {
  const dispatch = useDispatch();
  const { currentItem } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const { id, data } = props;
  const [duration, setDuration] = useState(100);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [LoadingPopup, setLoading, unsetLoading] = usePopupLoading("Uploading");

  const updateCanvas = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      if (ctx) {
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    }
  }, [canvasRef, videoRef]);

  const defaultTime = useMemo(
    () =>
      data[0]?.value.recording == id
        ? timestampToTime(data[0]?.value.timestamp || "00:00:00") / 1000
        : 0,
    [data, id]
  );

  const checked = useMemo(
    () =>
      !!data.filter(
        (d) => d.type == "Recording" && d.value?.recording == id
      )[0],
    [data, id]
  );

  useEffect(() => {
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { currentRecording: id },
    });
  }, [id]);

  const debouncer = useDebounce(500);

  const selectNewTimestamp = useCallback(
    (n: readonly number[]) => {
      if (videoRef.current) {
        videoRef.current.currentTime = n[0] / 1000;
        updateCanvas();
      }
    },
    [updateCanvas, checked, videoRef.current]
  );

  const scrubVideo = useCallback(
    (n: readonly number[]) => {
      debouncer(() => {
        selectNewTimestamp(n);
      });
    },
    [debouncer, selectNewTimestamp]
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setTimeout(() => {
          if (videoRef.current) videoRef.current.currentTime = defaultTime;
        }, 200);
        setDuration((videoRef.current?.duration || 0) * 1000);
        reduxAction(store.dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: { videoDuration: videoRef.current?.duration || 0 },
        });
      };
    }
  }, [videoRef.current]);

  const callback = useCallback(
    (rect: Rectangle, from: number, to: number) => {
      if (currentItem) {
        setLoading();
        const recordingVideo = `${recordingPath}/vid-${id}.webm`;
        setStatus("Trimming video...");
        cropVideo(
          `${from / 1000}`,
          `${to / 1000}`,
          Math.round(rect.width),
          Math.round(rect.height),
          Math.round(rect.x),
          Math.round(rect.y),
          recordingVideo,
          videoCropFileName
        )
          .then((file) => {
            setStatus("Uploading video...");
            return uploadFileToS3(file);
          })
          .then((url) => {
            setStatus("Updating item...");
            return updateItem<ItemVideo>({ url, source: "raw" }, currentItem);
          })
          .then((updatedItem) => {
            if (updatedItem) {
              reduxAction(dispatch, {
                type: "CREATE_LESSON_V2_SETITEM",
                arg: { item: updatedItem },
              });
            }
            unsetLoading();
            setStatus("Done");
          })
          .catch((e) => {
            unsetLoading();
            setStatus("Something went wrong trimming video!");
            console.error(e);
          });
      }
    },
    [dispatch, id, setLoading, unsetLoading, currentItem]
  );

  const [TrimPopup, doOpenTrimmer] = usePopupVideoTrim(id, callback);

  return (
    <>
      <LoadingPopup />
      <div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <video
          style={{ borderRadius: "5px", width: "300px" }}
          ref={videoRef}
          src={`${recordingPath}/vid-${id}.webm`}
        />
      </div>
      <div>
        <TrimPopup key={id} />
      </div>
      <ButtonSimple width="200px" height="24px" onClick={doOpenTrimmer}>
        Trim
      </ButtonSimple>
      <BaseSlider
        domain={[0, duration]}
        step={100}
        defaultValues={[defaultTime * 1000]}
        callback={scrubVideo}
        slideCallback={scrubVideo}
      />
    </>
  );
}
