import React, { useCallback, useEffect, useRef, useState } from "react";
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

export interface RecordingTypeValue {
  type: "Recording";
  value: {
    recording: string;
    time: number;
  };
}

export function RecordingsList(props: BasePanelViewProps<RecordingTypeValue>) {
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
    data.filter((d) => d.type == "Recording" && d.value.recording == a)[0];
  const filterFnCheck = (a: string) => !!filterFn(a);
  const filterFnUnCheck = (a: string) => !filterFn(a);

  return (
    <>
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
  props: BasePanelViewProps<RecordingTypeValue> & {
    id: string;
  }
) {
  const { id, data, select } = props;
  const [duration, setDuration] = useState(100);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const doCheckToggle = useCallback(
    (val: boolean) =>
      select(
        "Recording",
        val
          ? { recording: id, time: videoRef?.current?.currentTime || 0 }
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

  const scrubVideo = useCallback(
    (n: readonly number[]) => {
      if (videoRef.current) {
        videoRef.current.currentTime = n[0] / 1000;
      }
    },
    [videoRef.current]
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setDuration((videoRef.current?.duration || 0) * 1000);
        reduxAction(store.dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: { videoDuration: videoRef.current?.duration || 0 },
        });
      };
    }
  }, [videoRef.current]);

  const checked = !!data.filter(
    (d) => d.type == "Recording" && d.value.recording == id
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
        defaultValues={[videoRef.current?.currentTime || 0]}
        callback={scrubVideo}
        slideCallback={scrubVideo}
      />
    </>
  );
}
