import React, { useEffect, useRef, useState } from "react";
import fs from "fs";
import { BasePanelViewProps } from "../viewTypes";
import {
  recordingPath,
  stepSnapshotPath,
} from "../../../../electron-constants";
import ButtonSimple from "../../../button-simple";

export function RecordingsList(props: BasePanelViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { select, open } = props;

  const [videos, setVideos] = useState<string[]>([]);

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
        <ButtonSimple
          margin="8px auto"
          key={`recording-button-${id}`}
          width="135px"
          height="24px"
          onClick={() => open(id)}
        >
          {id}
        </ButtonSimple>
      ))}
    </>
  );
}

export function RecordingsView(props: BasePanelViewProps & { id: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, select, open } = props;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <>
      <video
        style={{ width: "300px" }}
        ref={videoRef}
        src={`${recordingPath}/vid-${id}.webm`}
      />
    </>
  );
}
