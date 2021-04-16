import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import fs from "fs";
import { BasePanelViewProps } from "../viewTypes";
import {
  itemsPath,
  recordingPath,
  stepSnapshotPath,
} from "../../../../electron-constants";
import BaseSlider from "../../../base-slider";
import ContainerWithCheck from "../../../container-with-check";
import ButtonCheckbox from "../../button-checkbox";
import reduxAction from "../../../../redux/reduxAction";
import store from "../../../../redux/stores/renderer";
import { RecordingCanvasTypeValue } from "../../../../api/types/step/step";
import timetoTimestamp from "../../../../../utils/timeToTimestamp";
import timestampToTime from "../../../../../utils/timestampToTime";
import useDebounce from "../../../../hooks/useDebounce";
import sha1 from "../../../../../utils/sha1";
import saveCanvasImage from "../../../../../utils/saveCanvasImage";
import uploadFileToS3 from "../../../../../utils/api/uploadFileToS3";
import usePopupLoading from "../../../../hooks/usePopupLoading";

export function RecordingsList(
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

  const filterFn = (a: string) =>
    data.filter((d) => d.type == "Recording" && d.value?.recording == a)[0];
  const filterFnCheck = (a: string) => !!filterFn(a);
  const filterFnUnCheck = (a: string) => !filterFn(a);

  return (
    <>
      <div className="panel-subtitle">Active</div>
      {videos.filter(filterFnCheck).map((id) => (
        <ButtonCheckbox
          text={id}
          margin="8px auto"
          key={`recording-button-${id}`}
          showDisabled={false}
          check
          onButtonClick={() => open(id)}
          onCheckClick={doUnCheck}
        />
      ))}
      <div className="panel-subtitle">Library</div>
      {videos.filter(filterFnUnCheck).map((id) => (
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

export function RecordingsView(
  props: BasePanelViewProps<RecordingCanvasTypeValue> & {
    id: string;
    noUpload?: boolean;
  }
) {
  const { id, data, select, noUpload } = props;
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
      data[0]?.value?.recording == id
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
        // if (checked) {
        //  select("Recording", null);
        // }
      }
    },
    [select, checked, videoRef.current]
  );

  const scrubVideo = useCallback(
    (n: readonly number[]) => {
      debouncer(() => {
        selectNewTimestamp(n);
      });
    },
    [debouncer, selectNewTimestamp]
  );

  const doCheckToggle = useCallback(
    (val: boolean) => {
      const timestamp = timetoTimestamp(
        (videoRef?.current?.currentTime || 0) * 1000
      );

      if (val && canvasRef.current) {
        if (noUpload) {
          select("Recording", {
            recording: id,
            timestamp,
          });
        } else {
          setLoading();
          saveCanvasImage(
            `${itemsPath}/${sha1(`step-${id}-${timestamp}`)}.png`,
            canvasRef.current
          )
            .then(uploadFileToS3)
            .then((url) => {
              select("Recording", {
                recording: id,
                timestamp,
                url,
              });
              unsetLoading();
            })
            .catch(unsetLoading);
        }
      } else {
        select("Recording", null);
      }
    },
    [videoRef, id, select]
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
      videoRef.current.onseeked = updateCanvas;
    }
  }, [videoRef.current, updateCanvas]);

  const videoDomain = useMemo(() => [0, duration], [duration]);
  const defaultNavigation = useMemo(() => [defaultTime * 1000], [defaultTime]);
  const stepValue = useMemo(() => 100, []);

  return (
    <>
      <LoadingPopup />
      <ContainerWithCheck checked={checked} callback={doCheckToggle}>
        <canvas
          id="video-canvas-panel"
          ref={canvasRef}
          style={{ display: "none" }}
        />
        <video
          id="video-panel"
          style={{ width: "300px" }}
          ref={videoRef}
          src={`${recordingPath}/vid-${id}.webm`}
        />
      </ContainerWithCheck>
      <BaseSlider
        domain={videoDomain}
        step={stepValue}
        defaultValues={defaultNavigation}
        callback={scrubVideo}
        slideCallback={scrubVideo}
      />
    </>
  );
}

export function RecordingsViewNoSlider(
  props: BasePanelViewProps<RecordingCanvasTypeValue> & {
    id: string;
  }
) {
  const { id } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <>
      <video
        id="video-autoplay-panel"
        style={{ width: "300px" }}
        ref={videoRef}
        autoPlay
        loop
        muted
        src={`${recordingPath}/vid-${id}.webm`}
      />
    </>
  );
}
