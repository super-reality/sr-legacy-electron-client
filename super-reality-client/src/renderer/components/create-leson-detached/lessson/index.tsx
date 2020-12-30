import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../containers.scss";
import "./index.scss";
import ButtonRound from "../../button-round";
import LessonTree from "../lesson-tree";

import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
import { AppState } from "../../../redux/stores/renderer";
import OpenItem from "../open-item";
import OpenStep from "../open-step";
import { Tabs, TabsContainer } from "../../tabs";
import LessonTreeControls from "../lesson-tree-controls";
import RecordingsView from "../recordings-view";

type Sections = "Lessons" | "Recordings";
const sections: Sections[] = ["Lessons", "Recordings"];

interface LessonProps {
  createRecorder: () => void;
}

export default function Lesson(props: LessonProps): JSX.Element {
  const dispatch = useDispatch();
  const { createRecorder } = props;
  const [view, setView] = useState<Sections>(sections[0]);
  const { treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const setViewPre = useCallback(
    (arg: Sections) => {
      setView(arg);
    },
    [dispatch]
  );

  return (
    <>
      <div
        className="tree-container"
        style={{
          height: `calc(100% - ${view == "Recordings" ? "80px" : "372px"})`,
        }}
      >
        <Tabs buttons={sections} initial={view} callback={setViewPre} />
        <TabsContainer
          style={{
            height: "-webkit-fill-available",
            flexGrow: 2,
            overflow: "auto",
          }}
        >
          {view == "Lessons" && <LessonTree />}
          {view == "Recordings" && <RecordingsView />}
        </TabsContainer>
      </div>
      {view == "Recordings" && (
        <ButtonRound
          svg={RecordIcon}
          width="48px"
          height="48px"
          svgStyle={{ width: "32px", height: "32px" }}
          style={{ margin: "16px auto" }}
          onClick={createRecorder}
        />
      )}
      {view == "Lessons" && (
        <div className="create-lesson-item-container shadow-blue mid-tight">
          <LessonTreeControls />
        </div>
      )}
      {treeCurrentType == "item" && view == "Lessons" && (
        <OpenItem id={treeCurrentId} />
      )}
      {treeCurrentType == "step" && view == "Lessons" && <OpenStep />}
    </>
  );
}
