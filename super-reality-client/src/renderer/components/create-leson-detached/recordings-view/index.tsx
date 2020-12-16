import React, { useCallback, useEffect, useState } from "react";
import fs from "fs";
import { useDispatch, useSelector } from "react-redux";
import ModalList from "../modal-list";
import { AppState } from "../../../redux/stores/renderer";
import { voidFunction } from "../../../constants";
import { stepSnapshotPath } from "../../../electron-constants";
import deleteSelectedRecording from "../lesson-utils/deleteSelectedRecording";
import setCanvasSource from "../../../redux/utils/setCanvasSource";
import reduxAction from "../../../redux/reduxAction";

export default function RecordingsView() {
  const [videos, setVideos] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { currentRecording } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const keyListeners = useCallback((e: KeyboardEvent) => {
    if (e.key === "Delete") {
      deleteSelectedRecording();
    }
  }, []);

  const setOpen = useCallback(
    (id: string | null) => {
      if (id) {
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_DATA",
          arg: {
            currentRecording: id,
          },
        });
        setCanvasSource("recording", id);
        document.onkeydown = keyListeners;
      }
    },
    [dispatch, keyListeners]
  );

  useEffect(() => {
    const newFiles: string[] = [];
    const files = fs.readdirSync(stepSnapshotPath);
    files
      .filter((f) => f.indexOf(".json") > -1)
      .map((f) => f.replace(".json", ""))
      .forEach((f) => newFiles.push(f));
    setVideos(newFiles);
  }, [currentRecording]);

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
