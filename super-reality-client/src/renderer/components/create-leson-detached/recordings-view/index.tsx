import React, { useCallback, useEffect, useState } from "react";
import fs from "fs";
import { useDispatch, useSelector } from "react-redux";
import ModalList from "../modal-list";
import { AppState } from "../../../redux/stores/renderer";
import { voidFunction } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import { stepSnapshotPath } from "../../../electron-constants";

export default function RecordingsView() {
  const [videos, setVideos] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { currentRecording } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const setOpen = useCallback(
    (id: string | null) => {
      if (id)
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: {
            currentRecording: id,
            currentCanvasSource: undefined,
            canvasSource: `recording ${id}`,
          },
        });
    },
    [dispatch]
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

  const current = currentRecording || "";

  return (
    <div>
      <ModalList
        options={videos.map((v) => {
          return {
            _id: v,
            name: v,
          };
        })}
        current=""
        selected={current}
        setCurrent={voidFunction}
        open={setOpen}
      />
    </div>
  );
}
