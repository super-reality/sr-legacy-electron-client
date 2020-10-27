import React, { useCallback, useEffect, useState } from "react";
import fs from "fs";
import { useDispatch, useSelector } from "react-redux";
import ModalList from "../modal-list";
import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
import userDataPath from "../../../../utils/userDataPath";
import { AppState } from "../../../redux/stores/renderer";
import { voidFunction } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import ButtonRound from "../../button-round";

interface RecordingsViewProps {
  createRecorder: () => void;
}

export default function RecordingsView(props: RecordingsViewProps) {
  const { createRecorder } = props;
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
          },
        });
    },
    [dispatch]
  );

  useEffect(() => {
    const userData = userDataPath();
    const newFiles: string[] = [];
    const files = fs.readdirSync(`${userData}/step/snapshots/`);
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
      <ButtonRound
        svg={RecordIcon}
        width="48px"
        height="48px"
        svgStyle={{ width: "32px", height: "32px" }}
        style={{ margin: "16px auto" }}
        onClick={createRecorder}
      />
    </div>
  );
}
