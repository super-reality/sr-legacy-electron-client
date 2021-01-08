import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import fs from "fs";
import { BasePanelViewProps } from "../viewTypes";
import {
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
  }
) {
  const { id, data, select } = props;
  const [duration, setDuration] = useState(100);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const defaultTime = useMemo(
    () =>
      data[0]?.value.recording == id
        ? timestampToTime(data[0]?.value.timestamp || "00:00:00") / 1000
        : 0,
    [data, id]
  );

  const doCheckToggle = useCallback(
    (val: boolean) =>
      select(
        "Recording",
        val
          ? {
              recording: id,
              timestamp: timetoTimestamp(
                (videoRef?.current?.currentTime || 0) * 1000
              ),
            }
          : null
      ),
    [videoRef, id, select]
  );

  useEffect(() => {
    reduxAction(store.dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { currentRecording: id },
    });
  }, [id]);

  const debouncer = useDebounce(500);

  const scrubVideo = useCallback(
    (n: readonly number[]) => {
      debouncer(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = n[0] / 1000;
        }
        select("Recording", {
          recording: id,
          timestamp: timetoTimestamp(
            (videoRef?.current?.currentTime || 0) * 1000
          ),
        });
      });
    },
    [debouncer, select, videoRef.current]
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

  const checked = !!data.filter(
    (d) => d.type == "Recording" && d.value?.recording == id
  )[0];

  return (
    <>
      <ContainerWithCheck checked={checked} callback={doCheckToggle}>
        <video
          style={{ width: "300px" }}
          ref={videoRef}
          src={`${recordingPath}/vid-${id}.webm`}
        />
      </ContainerWithCheck>
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
