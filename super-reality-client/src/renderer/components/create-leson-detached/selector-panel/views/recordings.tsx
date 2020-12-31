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

export interface RecordingTypeValue {
  type: "Recording";
  value: {
    recording: string;
    time: number;
  };
}

export function RecordingsList(props: BasePanelViewProps<RecordingTypeValue>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { select, value, open } = props;

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
          check={value?.recording == id}
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
  const { id, value, select } = props;
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

  const scrubVideo = useCallback(
    (n: readonly number[]) => {
      if (videoRef.current) {
        console.log(n);
        videoRef.current.currentTime = n[0] / 1000;
      }
    },
    [videoRef.current]
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setDuration((videoRef.current?.duration || 0) * 1000);
      };
    }
  }, [videoRef.current]);

  return (
    <>
      <ContainerWithCheck
        checked={value?.recording == id}
        callback={doCheckToggle}
      >
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
